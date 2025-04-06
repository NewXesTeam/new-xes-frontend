import * as React from 'react';
import { Button } from 'react-bootstrap';
import xterm from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit/src/FitAddon';
import { CanvasAddon } from '@xterm/addon-canvas';
import { WebglAddon } from '@xterm/addon-webgl';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import type { BasicResponse } from '@/interfaces/common';
import type { PublishWorkInfo } from '@/interfaces/work';
import { b64_to_utf8 } from '@/utils';
import '@/styles/xterm.scss';

const { Terminal } = xterm;

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

const WSTerminal = ({ id }: { id: number | string }) => {
    const [runningState, setRunningState] = React.useState<boolean>(false);

    const terminal = React.useRef(
        new Terminal({
            fontSize: 20,
            fontFamily: "'Cascadia Code', Consolas, 'Courier New', monospace",
            theme: xtermTheme,
            cursorBlink: true,
            allowProposedApi: true,
            allowTransparency: true,
            cursorStyle: 'bar',
        }),
    );
    const addons = React.useRef([]);
    const websocket = React.useRef<WebSocket>(null);

    const onClickRun = async () => {
        if (runningState && websocket.current) {
            websocket.current.close();
            terminal.current.write('\r\n\r\n\x1b[31m运行终止\x1b[0m');
            return;
        }

        const response = await fetch(`/api/compilers/v2/${id}`);
        const responseData: BasicResponse<PublishWorkInfo> = await response.json();
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
                        xml: responseData.data.xml,
                        type: 'run',
                        lang: responseData.data.lang,
                        original_id: 1,
                    }),
            );

            term.reset();
            term.onData(() => null);
            let text: string = '';
            term.onData(data => {
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="primary" onClick={() => onClickRun()}>
                    {runningState ? '运行中' : '运行'}
                </Button>
                <Button variant="primary" onClick={() => terminal.current.reset()}>
                    清除终端
                </Button>
            </div>
            <div
                ref={terminalRef => {
                    if (terminalRef) {
                        if (!terminal.current.element) {
                            addons.current = [
                                new FitAddon(),
                                new CanvasAddon(),
                                new WebglAddon(),
                                new WebLinksAddon(),
                                new Unicode11Addon(),
                            ];
                            const term = terminal.current;
                            for (const addon of addons.current) {
                                term.loadAddon(addon);
                            }
                            term.open(terminalRef);
                            addons.current[0].fit();
                            window.addEventListener('resize', () => {
                                addons.current[0].fit();
                            });
                        }
                    }
                }}
                style={{
                    flexGrow: 1,
                    width: '100%',
                }}
            />
        </div>
    );
};

export default WSTerminal;
