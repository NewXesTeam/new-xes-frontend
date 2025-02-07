import * as React from 'react';
import { createRoot } from 'react-dom/client';
import WSTerminal from '@/components/WSTerminal';
import { checkLoggedIn } from '@/utils';
import '@/styles/common.scss';

const EmbedCppPage = () => {
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
    root.render(<EmbedCppPage />);
} else {
    throw new Error('Cannot find dom element #app');
}
