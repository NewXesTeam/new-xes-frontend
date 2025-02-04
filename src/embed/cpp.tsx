import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'react-bootstrap';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { checkLoggedIn, b64_to_utf8 } from '@/utils';
import '@/styles/common.scss';
import '../../node_modules/xterm/css/xterm.css';

const EmbedCppPage = () => {
    if (!checkLoggedIn()) {
        location.href = '/login.html';
        return null;
    }
    const [runningState, setRunningState] = React.useState<boolean>(false);

    const xtermTheme = {
        foreground: "#F8F8F8",
        background: "#2D2E2C",
        selection: "#5DA5D533",
        black: "#1E1E1D",
        brightBlack: "#262625",
        red: "#CE5C5C",
        brightRed: "#FF7272",
        green: "#5BCC5B",
        brightGreen: "#72FF72",
        yellow: "#CCCC5B",
        brightYellow: "#FFFF72",
        blue: "#5D5DD3",
        brightBlue: "#7279FF",
        magenta: "#BC5ED1",
        brightMagenta: "#E572FF",
        cyan: "#5DA5D5",
        brightCyan: "#72F0FF",
        white: "#F8F8F8",
        brightWhite: "#FFFFFF",
    };
    
    const param: URLSearchParams = new URLSearchParams(location.search);
    const from: string | null = param.get('from');
    const id: string | null = param.get('id');
    const show_only_answer: string | null = param.get('show_only_answer');
    const v: string | null = param.get('v');

    const terminalRef = React.useRef<HTMLDivElement>(null);
    const fitAddonRef = React.useRef(new FitAddon());
    const terminal = React.useRef(new Terminal({
        fontSize: 15,
        fontFamily: "monospace",
        theme: xtermTheme,
        cursorBlink: true,
        allowProposedApi: true,
        allowTransparency: true,
        cursorStyle: "bar",
    }));
    terminal.current.write("\r\n");

    let ws: WebSocket | null = null;
    
    const onClickRun = async () => {
        const response = await fetch(`/api/compilers/v2/${id}/?from=${from}&show_only_answer=${show_only_answer}&v=${v}&id=${id}`);
        const responseData = await response.json();
        const term = terminal.current;
        ws = new WebSocket(`wss://codedynamic.xueersi.com/api/compileapi/ws/run`);
        
        const hearbeat = setInterval(() => {
            ws.send('2');
        }, 10000);

        ws.onopen = () => {
            setRunningState(true);
            ws.send('{}');
            ws.send("7"+JSON.stringify({xml: responseData.data.xml, type: "run", lang: responseData.data.lang, original_id: 1}))
            
            term.reset();
            term.onData((data)=>null);
            let text: string = "";
            // term.clear();
            term.onData(data => {
                var flag: boolean = (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING)
                // console.log(e);
                if (data === '\r' && !flag) {
                    // console.log(text);
                    text = "";
                    ws.send('1\n')
                }else if (data === '\x7F' && !flag) {
                    // term.write('\b \b');
                    if (text.length > 0) {
                        // let char_width = wcswidth(text[text.length - 1]);
                        text = text.slice(0, -1);
                        ws.send('1'+data);
                        // term.write("\b \b".repeat(char_width));
                    }
                }else if (!flag) {
                    text += data;
                    ws.send('1'+data);
                }
            });
        };
        ws.onmessage = (event) => {
            const data: string = event.data;
            const ans: string = data.slice(1);
            // console.log(data.slice(1));
            switch (data[0]) {
                case '1':
                    term.write(b64_to_utf8(ans));
                    return;
                case '7':
                    var d = JSON.parse(b64_to_utf8(ans));
                    if (d.Type === 'compileSuccess') term.write('\x1b[32m'+d.Info+'\x1b[0m');
                    else if (d.Type === 'runInfo'){
                        term.write(`\r\n\r\n\x1b[33m`+d.Info.replace("\r\n\r\n","")+`\x1b[1m`);
                        ws.close();
                    }
                    return;
                case '3':
                    return;
                case '2':
                    return;
                default:
                    term.write("出错了");
                    return;
            }
        };
        ws.onclose = () => {
            clearInterval(hearbeat);
            setRunningState(false);
            term.onData((data)=>null);
        }
    };

    React.useEffect(() => {
        let ignore = false;
    
        const func = async () => {
            if (terminalRef.current) {
                const term = terminal.current;
                term.loadAddon(fitAddonRef.current);
                term.open(terminalRef.current);
                fitAddonRef.current.fit(); // 初始化时调整大小以适应容器
            }
        }
    
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            <Button style={{ position: 'absolute', left: '0px' }} variant="primary" onClick={() => onClickRun()}>运行</Button>
            <Button style={{ position: 'absolute', right: '0px' }} variant="primary" onClick={() => {
                terminal.current.reset();
                terminal.current.write("\r\n");
            }}>清除终端</Button>
            <div ref={terminalRef} style={{ width: window.innerWidth-10+'px', height: window.innerHeight-40+'px', borderRadius: '15px', border: '1px solid #ccc', overflow: 'hidden', position: 'absolute', top: '40px', left: '0px' }} />
        </>
    );
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(<EmbedCppPage />);
} else {
    throw new Error('Cannot find dom element #app');
}
