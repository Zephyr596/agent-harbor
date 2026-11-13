"""Synchronize a connected client's attention without replacing desktop notifications."""
import ctypes
import ctypes.util


class DesktopAttention:
    """Temporarily clear X input focus; restore only if nobody else changed it."""
    def __init__(self):
        self.x = ctypes.CDLL(ctypes.util.find_library('X11'))
        self.x.XOpenDisplay.argtypes = [ctypes.c_char_p]
        self.x.XOpenDisplay.restype = ctypes.c_void_p
        self.x.XGetInputFocus.argtypes = [ctypes.c_void_p, ctypes.POINTER(ctypes.c_ulong), ctypes.POINTER(ctypes.c_int)]
        self.x.XSetInputFocus.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.c_int, ctypes.c_ulong]
        self.x.XGetWindowAttributes.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.c_void_p]
        self.x.XFlush.argtypes = [ctypes.c_void_p]
        self.x.XCloseDisplay.argtypes = [ctypes.c_void_p]
        self.on_error = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_void_p, ctypes.c_void_p)(lambda unused, error: 0)
        self.x.XSetErrorHandler.argtypes = [type(self.on_error)]
        self.x.XSetErrorHandler(self.on_error)
        self.display = self.x.XOpenDisplay(None)
        if not self.display:
            raise RuntimeError('X display unavailable')
        self.saved = None

    def current(self):
        window, revert = ctypes.c_ulong(), ctypes.c_int()
        self.x.XGetInputFocus(self.display, ctypes.byref(window), ctypes.byref(revert))
        return window.value

    def set_active(self, active):
        current = self.current()
        if not active:
            if current > 1 and self.saved is None:
                self.saved = current
                self.x.XSetInputFocus(self.display, 0, 1, 0)
                self.x.XFlush(self.display)
        else:
            saved, self.saved = self.saved, None
            if saved is not None and current == 0:
                attributes = ctypes.create_string_buffer(512)
                if self.x.XGetWindowAttributes(self.display, saved, attributes):
                    self.x.XSetInputFocus(self.display, saved, 1, 0)
                    self.x.XFlush(self.display)

    def close(self):
        self.set_active(True)
        self.x.XCloseDisplay(self.display)
