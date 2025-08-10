import * as React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { WebIDE } from '~/XesCodingIDE/ide/WebIDE';
import type { Route } from './+types/cpp';
import '@/styles/app.css';

export async function loader({ request, params }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
        userId: request.headers.get('Cookie')?.split('stu_id=')[1].split(';')[0] || '1',
        id: params.workId,
    };
}

export default function IdeCppPage({ loaderData }: Route.ComponentProps) {
    if (!loaderData.isLoggedIn) {
        React.useEffect(() => {
            location.href = '/login.html';
        }, []);
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    bgcolor: '#f5f7fa',
                }}
            >
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return <WebIDE className="w-full h-full" workId={loaderData.id} userId={loaderData.userId} type="cpp" />;
}
