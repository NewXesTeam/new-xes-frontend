import * as React from 'react';
import { Button } from '@mui/material';
import { b64_to_utf8 } from '@/utils';
import '@/styles/xterm.css';

const xtermTheme = {
    foreground: '#F8F8F8',
    background: '#2D2E2C',
    selection: '#5DA5D533',
    black: '#1E1E1D',
    brightBlack: '#262625',
    red: '#CE5C5C',
    brightRed: '#FF7272',
    green: '#5BCC5B',
    brightGreen: '#72FF72',
    yellow: '#CCCC5B',
    brightYellow: '#FFFF72',
    blue: '#5D5DD3',
    brightBlue: '#7279FF',
    magenta: '#BC5ED1',
    brightMagenta: '#E572FF',
    cyan: '#5DA5D5',
    brightCyan: '#72F0FF',
    white: '#F8F8F8',
    brightWhite: '#FFFFFF',
};

const WSTerminal = ({ code, lang }: { code: string; lang: string }) => {
    const [runningState, setRunningState] = React.useState<boolean>(false);
    const [terminal, setTerminal] = React.useState<any>(null);
    const [addons, setAddons] = React.useState<any[]>([]);
    const websocket = React.useRef<WebSocket>(null);

    const terminalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const func = async () => {
            if (!terminal) {
                const { Terminal } = await import('@xterm/xterm');
                const { FitAddon } = await import('@xterm/addon-fit');
                const { CanvasAddon } = await import('@xterm/addon-canvas');
                const { WebglAddon } = await import('@xterm/addon-webgl');
                const { WebLinksAddon } = await import('@xterm/addon-web-links');
                const { Unicode11Addon } = await import('@xterm/addon-unicode11');

                const term = new Terminal({
                    rows: 25,
                    cols: 80,
                    fontSize: 18,
                    fontFamily:
                        '"Jetbrains Mono", "Fira Code", "Cascadia Code", "Noto Emoji", "Segoe UI Emoji", "Lucida Console", Menlo, courier-new, courier, monospace',
                    theme: xtermTheme,
                    cursorBlink: true,
                    allowProposedApi: true,
                    allowTransparency: true,
                    cursorStyle: 'bar',
                });

                setTerminal(term);
                setAddons([
                    new FitAddon(),
                    new CanvasAddon(),
                    new WebglAddon(),
                    new WebLinksAddon(),
                    new Unicode11Addon(),
                ]);
            }
        };

        func();

        return () => {
            if (terminal && addons.length > 0) {
                window.removeEventListener('resize', () => {
                    addons[0].fit();
                });
            }
        };
    }, [terminal, addons]);

    const onClickRun = async () => {
        if (runningState && websocket.current) {
            websocket.current.close();
            terminal.write('\r\n\r\n\x1b[31m运行终止\x1b[0m');
            return;
        }

        websocket.current = new WebSocket(`wss://codedynamic.xueersi.com/api/compileapi/ws/run`);

        const term = terminal;
        const ws = websocket.current;

        const heartbeat = setInterval(() => {
            ws.send('2');
        }, 10000);

        ws.onopen = () => {
            setRunningState(true);
            ws.send('{}');
            ws.send(
                '7' +
                    JSON.stringify({
                        xml: code,
                        type: 'run',
                        lang: lang,
                        original_id: 1,
                    }),
            );

            term.reset();
            term.onData(() => null);
            let text: string = '';
            term.onData((data: string) => {
                let flag: boolean = ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING;
                if (data === '\r' && !flag) {
                    text = '';
                    ws.send('1\n');
                } else if (data === '\x7F' && !flag) {
                    if (text.length > 0) {
                        text = text.slice(0, -1);
                        ws.send('1' + data);
                    }
                } else if (!flag) {
                    text += data;
                    ws.send('1' + data);
                }
            });
        };

        ws.onmessage = event => {
            const eventId: string = event.data[0];
            const eventData: string = event.data.slice(1);
            switch (eventId) {
                case '1':
                    term.write(b64_to_utf8(eventData));
                    return;
                case '2':
                    return;
                case '3':
                    return;
                case '7':
                    const outputData = JSON.parse(b64_to_utf8(eventData));
                    if (outputData.Type === 'compileSuccess') term.write('\x1b[32m' + outputData.Info + '\x1b[0m');
                    else if (outputData.Type === 'compileFail') term.write('\x1b[31m' + outputData.Info + '\x1b[0m');
                    else if (outputData.Type === 'compile') term.write('\x1b[31m' + outputData.OutRaw + '\x1b[0m');
                    else if (outputData.Type === 'runInfo') {
                        term.write(`\x1b[33m` + outputData.Info + `\x1b[1m`);
                        ws.close();
                    }
                    return;
                default:
                    console.log('WSTerminal: unknown event', eventId, eventData);
                    return;
            }
        };

        ws.onclose = () => {
            clearInterval(heartbeat);
            setRunningState(false);
            term.onData(() => null);
        };
    };

    React.useEffect(() => {
        if (terminal && addons.length > 0) {
            if (terminalRef.current && !terminal.element) {
                for (const addon of addons) {
                    terminal.loadAddon(addon);
                }
                terminal.open(terminalRef.current);
                addons[0].fit();
                window.addEventListener('resize', () => {
                    addons[0].fit();
                });
            }
        }
    }, [terminal, addons]);

    return (
        <div style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button color="primary" variant="contained" onClick={() => onClickRun()}>
                    {runningState ? '运行中' : '运行'}
                </Button>
                <Button color="primary" variant="contained" onClick={() => terminal && terminal.reset()}>
                    清除终端
                </Button>
            </div>
            <div ref={terminalRef} />
        </div>
    );
};

export default WSTerminal;
