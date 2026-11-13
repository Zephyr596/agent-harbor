#!/usr/bin/env python3
"""Verify CUDA driver computation as the unprivileged sandbox user; no SDK needed."""
import ctypes as C
import json


def main():
    cuda = C.CDLL('libcuda.so.1')
    ptr = C.c_void_p
    u64 = C.c_uint64
    signatures = {
        'cuInit': [C.c_uint], 'cuDeviceGet': [C.POINTER(C.c_int), C.c_int],
        'cuDeviceGetName': [ptr, C.c_int, C.c_int],
        'cuCtxCreate_v2': [C.POINTER(ptr), C.c_uint, C.c_int],
        'cuModuleLoadData': [C.POINTER(ptr), ptr],
        'cuModuleGetFunction': [C.POINTER(ptr), ptr, C.c_char_p],
        'cuMemAlloc_v2': [C.POINTER(u64), C.c_size_t],
        'cuLaunchKernel': [ptr] + [C.c_uint] * 7 + [ptr, C.POINTER(ptr), C.POINTER(ptr)],
        'cuCtxSynchronize': [], 'cuMemcpyDtoH_v2': [ptr, u64, C.c_size_t],
        'cuMemFree_v2': [u64], 'cuModuleUnload': [ptr], 'cuCtxDestroy_v2': [ptr],
    }
    for name, args in signatures.items():
        getattr(cuda, name).argtypes = args
        getattr(cuda, name).restype = C.c_int

    def call(name, *args):
        status = getattr(cuda, name)(*args)
        if status:
            raise RuntimeError(f'{name} returned CUDA status {status}')

    call('cuInit', 0)
    device = C.c_int()
    call('cuDeviceGet', C.byref(device), 0)
    name = C.create_string_buffer(256)
    call('cuDeviceGetName', name, len(name), device)
    context, module, kernel = ptr(), ptr(), ptr()
    memory = u64()
    call('cuCtxCreate_v2', C.byref(context), 0, device)
    try:
        ptx = C.create_string_buffer(b'''
.version 7.0
.target sm_80
.address_size 64
.visible .entry harbor_store42(.param .u64 out) {
    .reg .b64 %rd1;
    .reg .b32 %r1;
    ld.param.u64 %rd1, [out];
    mov.u32 %r1, 42;
    st.global.u32 [%rd1], %r1;
    ret;
}
''')
        call('cuModuleLoadData', C.byref(module), ptx)
        call('cuModuleGetFunction', C.byref(kernel), module, b'harbor_store42')
        call('cuMemAlloc_v2', C.byref(memory), 4)
        args = (ptr * 1)(C.cast(C.byref(memory), ptr))
        call('cuLaunchKernel', kernel, 1, 1, 1, 1, 1, 1, 0, None, args, None)
        call('cuCtxSynchronize')
        result = C.c_uint32()
        call('cuMemcpyDtoH_v2', C.byref(result), memory, 4)
        if result.value != 42:
            raise RuntimeError(f'Unexpected GPU result: {result.value}')
        print(json.dumps({'gpu': name.value.decode(), 'cuda_kernel_result': result.value}))
    finally:
        if memory.value:
            call('cuMemFree_v2', memory)
        if module.value:
            call('cuModuleUnload', module)
        call('cuCtxDestroy_v2', context)


if __name__ == '__main__':
    main()
