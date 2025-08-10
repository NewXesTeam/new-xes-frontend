import * as React from 'react';
import { Terminal } from '~/XesCodingIDE';
import '@/styles/app.css';

import type { BasicResponse } from '@/interfaces/common';
import type { PublishWorkInfo } from '@/interfaces/work';
import type { Route } from './+types/cpp';

export async function loader({ request, params }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
        id: params.workId,
    };
}

export default function EmbedCppPage({ loaderData }: Route.ComponentProps) {
    if (!loaderData.isLoggedIn) {
        location.href = '/login.html';
        return null;
    }
    if (loaderData.id === null) {
        return <div>请提供有效的 id 参数</div>;
    }

    const id = loaderData.id;
    const [code, setCode] = React.useState('');
    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(`/api/compilers/v2/${id}`);
            const responseData: BasicResponse<PublishWorkInfo> = await response.json();
            setCode(responseData.data.xml);
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    return <Terminal className="w-full h-full" lang="cpp" code={code} />;
}
