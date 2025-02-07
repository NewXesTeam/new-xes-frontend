import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { checkLoggedIn } from '@/utils';
import WSTerminal from '@/components/WSTerminal';
import '@/styles/common.scss';

const EmbedPythonPage = () => {
    if (!checkLoggedIn()) {
        location.href = '/login.html';
        return null;
    }

    const param: URLSearchParams = new URLSearchParams(location.search);
    const id: string | null = param.get('id');

    return <WSTerminal id={id} />;
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(
        <React.StrictMode>
            <EmbedPythonPage />
        </React.StrictMode>,
    );
} else {
    throw new Error('Cannot find dom element #app');
}
