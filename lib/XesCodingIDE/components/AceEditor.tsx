// Fuck React-Ace, it's not working.
import * as React from 'react';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/snippets/c_cpp';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-settings_menu';

interface IAceEditorProps {
    value: string;
    mode: string;
    theme: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    fontSize?: number;
    tabSize?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function AceEditor({
    value,
    mode,
    theme,
    onChange,
    readOnly = false,
    fontSize = 14,
    tabSize = 4,
    className = undefined,
    style = undefined,
}: IAceEditorProps) {
    const editorRef = React.useRef<HTMLDivElement>(null);
    const aceEditorRef = React.useRef<ace.Ace.Editor | null>(null);

    React.useEffect(() => {
        if (editorRef.current && !aceEditorRef.current) {
            aceEditorRef.current = ace.edit(editorRef.current, {
                value: value,
                mode: `ace/mode/${mode}`,
                theme: `ace/theme/${theme}`,
                readOnly: readOnly,
                fontSize: fontSize,
                tabSize: tabSize,
                showGutter: true,
                showLineNumbers: true,
                showPrintMargin: false,
                wrap: false,
                useWorker: false,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                highlightActiveLine: true,
            });

            aceEditorRef.current.session.on('change', () => {
                const newValue = aceEditorRef.current?.getValue() || '';
                if (onChange) {
                    onChange(newValue);
                }
            });
        }

        return () => {
            if (aceEditorRef.current) {
                aceEditorRef.current.destroy();
                aceEditorRef.current = null;
            }
        };
    }, [editorRef.current]);

    React.useEffect(() => {
        if (aceEditorRef.current && aceEditorRef.current.getValue() !== value) {
            aceEditorRef.current.setValue(value, -1);
        }
    }, [value]);

    return <div ref={editorRef} className={className} style={style} />;
}
