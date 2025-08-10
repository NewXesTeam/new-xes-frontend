import * as React from 'react';
import { Button } from '@mui/material';
import { Clear, PlayCircleOutline, StopCircleOutlined } from '@mui/icons-material';
import { b64_to_utf8, type RefState } from '../utils';
import '../styles/ide.css';

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

export function Terminal({
    code,
    lang,
    className,
    toFitDOM,
}: {
    code: string;
    lang: string;
    className?: string;
    toFitDOM?: RefState<() => void>;
}) {
    const [runningState, setRunningState] = React.useState<boolean>(false);
    const websocket = React.useRef<WebSocket | null>(null);
    const terminal = React.useRef<any>(undefined);
    const addons = React.useRef<any[]>([]);
    const terminalDOM = React.useRef<HTMLDivElement>(null);

    const onClickRun = async () => {
        if (runningState && websocket.current) {
            websocket.current.close();
            terminal.current.write('\r\n\r\n\x1b[31m运行终止\x1b[0m');
            return;
        }

        websocket.current = new WebSocket(`wss://codedynamic.xueersi.com/api/compileapi/ws/run`);

        const term = terminal.current;
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
                    console.log('Terminal: unknown event', eventId, eventData);
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
        (async () => {
            if (!terminal.current) {
                const { Terminal } = await import('@xterm/xterm');
                const { FitAddon } = await import('@xterm/addon-fit');
                const { CanvasAddon } = await import('@xterm/addon-canvas');
                const { WebglAddon } = await import('@xterm/addon-webgl');
                const { WebLinksAddon } = await import('@xterm/addon-web-links');
                const { Unicode11Addon } = await import('@xterm/addon-unicode11');

                terminal.current = new Terminal({
                    rows: 25,
                    cols: 80,
                    fontSize: 18,
                    fontFamily:
                        '"Cascadia Code", "Jetbrains Mono", "Fira Code", "Noto Emoji", "Segoe UI Emoji", "Lucida Console", Menlo, courier-new, courier, monospace',
                    theme: xtermTheme,
                    cursorBlink: true,
                    allowProposedApi: true,
                    allowTransparency: true,
                    cursorStyle: 'bar',
                });
                addons.current = [
                    new FitAddon(),
                    new CanvasAddon(),
                    new WebglAddon(),
                    new WebLinksAddon(),
                    new Unicode11Addon(),
                ];
            }

            if (terminal.current && addons.current.length > 0) {
                if (terminalDOM.current && !terminal.current.element) {
                    for (const addon of addons.current) {
                        terminal.current.loadAddon(addon);
                    }
                    terminal.current.open(terminalDOM.current);
                    addons.current[0].fit();
                    window.addEventListener('resize', () => {
                        addons.current[0].fit();
                    });
                    toFitDOM?.set(() => {
                        return () => {
                            addons.current[0].fit();
                        };
                    });
                    console.log('fuck', toFitDOM);
                }
            }
        })();

        return () => {
            terminalDOM.current?.children[0].remove();
        };
    }, [terminal.current, addons.current]);

    return (
        <div className={'flex flex-col overflow-hidden ' + className}>
            <div className="flex justify-between">
                <div className="flex">
                    <Button
                        color={runningState ? 'secondary' : 'primary'}
                        variant="contained"
                        startIcon={runningState ? <StopCircleOutlined /> : <PlayCircleOutline />}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            boxShadow: runningState ? 2 : 1,
                            minWidth: 90,
                        }}
                        onClick={() => onClickRun()}
                    >
                        {runningState ? '运行中' : '运行'}
                    </Button>
                </div>
                <div className="flex">
                    <Button
                        color="info"
                        variant="outlined"
                        startIcon={<Clear />}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            minWidth: 90,
                        }}
                        onClick={() => terminal.current && terminal.current.reset()}
                    >
                        清除终端
                    </Button>
                </div>
            </div>
            <div ref={terminalDOM} className="flex-1" />
        </div>
    );
}
