import * as React from 'react';
import WSTerminal from '@/components/WSTerminal';
import '@/styles/app.scss';

import type { Route } from './+types/python';

export async function loader({ request }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
        id: new URL(request.url).searchParams.get('id'),
    };
}

export default function EmbedPythonPage({ loaderData }: Route.ComponentProps) {
    if (!loaderData.isLoggedIn) {
        location.href = '/login.html';
        return null;
    }
    if (loaderData.id === null) {
        return <div>请提供有效的 id 参数</div>;
    }

    const id = loaderData.id;

    return <WSTerminal id={id} />;
}
