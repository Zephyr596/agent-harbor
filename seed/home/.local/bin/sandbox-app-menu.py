#!/usr/bin/env python3
import curses,os,subprocess

OPTIONS = [
    ('浏览器（仅容器隔离）', ['/config/.local/bin/sandbox-browser']),
    ('终端', ['/config/.local/bin/sandbox-terminal']),
    ('运行其他命令…', ['/usr/bin/i3-input','-f','pango:DejaVu Sans Mono 11',
                    '-P','Run app: ', '-F','exec --no-startup-id env PATH=/config/.local/bin:/usr/local/bin:/usr/bin:/bin %s']),
    ('Claude Desktop', ['/config/.local/bin/sandbox-claude-desktop']),
]

def menu(screen):
    try:curses.curs_set(0)
    except curses.error:pass
    screen.keypad(True)
    selected=0
    while True:
        screen.erase()
        h,w=screen.getmaxyx()
        def line(y,text,attr=0):
            if 0<=y<h:
                try:screen.addstr(y,2,text[:max(0,(w-4)//2)],attr)
                except curses.error:pass
        line(1,'应用启动器 / Applications',curses.A_BOLD)
        line(3,'↑↓ 选择   Enter 打开   Esc 关闭')
        for n,(label,_) in enumerate(OPTIONS):
            line(5+n*2,f'{n+1}. {label}',curses.A_REVERSE if n==selected else 0)
        line(min(h-2,15),'也可直接按 1 / 2 / 3 / 4')
        screen.refresh()
        k=screen.get_wch()
        if k in ('\x1b','q','Q'):return None
        if k in (curses.KEY_UP,'k'):selected=(selected-1)%len(OPTIONS)
        elif k in (curses.KEY_DOWN,'j','\t'):selected=(selected+1)%len(OPTIONS)
        elif k in ('\n','\r',curses.KEY_ENTER):return OPTIONS[selected][1]
        elif k in ('1','b','B'):return OPTIONS[0][1]
        elif k in ('2','t','T'):return OPTIONS[1][1]
        elif k in ('3','r','R'):return OPTIONS[2][1]
        elif k in ('4','c','C'):return OPTIONS[3][1]

command=curses.wrapper(menu)
if command:
    env=os.environ.copy()
    env['PATH']='/config/.local/bin:'+env.get('PATH','/usr/bin:/bin')
    subprocess.Popen(command,env=env,stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,
                     stderr=subprocess.DEVNULL,start_new_session=True)
