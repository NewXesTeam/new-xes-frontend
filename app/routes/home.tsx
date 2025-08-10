import * as React from 'react';
import AppLayout from '@/layout/AppLayout';
import WorkList from '@/components/WorkList';
import { Typography } from '@mui/material';

import type { Work } from '@/interfaces/work';
import type { Route } from './+types/home';

export async function loader({ request }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
    };
}
export default function IndexPage({ loaderData }: Route.ComponentProps) {
    const [works, setWorks] = React.useState<Array<Work>>([]);

    React.useEffect(() => {
        let ignore = false;

        const fetchWorkData = async () => {
            const response = await fetch('/api/index/works/follows');
            let data = await response.json();
            let workData: Array<Work> = data.data.filter(Boolean);
            setWorks(workData);
        };

        if (!ignore) fetchWorkData();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <AppLayout>
            <div className="container mx-auto">
                {!loaderData.isLoggedIn && (
                    <Typography variant="h4" component="h1" className="text-center">
                        欢迎来到NewXesFrontend
                    </Typography>
                )}
                {loaderData.isLoggedIn && (
                    <Typography variant="h4" component="h1" className="text-center">
                        我的关注
                    </Typography>
                )}
                <WorkList works={works} className="m-4" />
            </div>
        </AppLayout>
    );
}
