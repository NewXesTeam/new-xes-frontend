import * as React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { redirect } from 'react-router';
import AppLayout from '@/layout/AppLayout';
import WorkList from '@/components/WorkList';
import { Pagination } from '@/components/Pagination';

import type { Route } from './+types/discover';
import type { WorkList as IWorkList } from '@/interfaces/work';

export async function loader({ request }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
    };
}

export default function DiscoverPage({ loaderData }: Route.ComponentProps) {
    if (!loaderData.isLoggedIn) {
        redirect('/login');
        return null;
    }

    const [currentPage, setCurrentPage] = React.useState(1);
    const [orderLang, setOrderLang] = React.useState<string>('');
    const [orderType, setOrderType] = React.useState<string>('latest');
    const [works, setWorks] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/works/${orderType}?lang=${orderLang}&page=${currentPage}&per_page=50`);
            const responseData: IWorkList = await response.json();
            // console.log(responseData);

            if (responseData['total'] === 0) {
                setWorks(<h2>暂无作品</h2>);
            }
            setWorks(
                <>
                    <WorkList works={responseData.data} />
                    {responseData.total > 20 && (
                        <div style={{ width: '100%' }}>
                            <Pagination
                                pageCount={Math.ceil(responseData.total / 20)}
                                value={currentPage}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="mx-auto w-fit"
                            />
                        </div>
                    )}
                </>,
            );
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [currentPage, orderLang, orderType]);

    return (
        <AppLayout>
            <div className="container mx-auto">
                <div className="flex justify-between mb-3">
                    <ToggleButtonGroup
                        value={orderLang}
                        exclusive
                        onChange={(event, newLang) => {
                            if (newLang !== null) {
                                setOrderLang(newLang);
                                setCurrentPage(1);
                            }
                        }}
                    >
                        <ToggleButton value="">全部</ToggleButton>
                        <ToggleButton value="scratch">TurboWarp</ToggleButton>
                        <ToggleButton value="python">Python</ToggleButton>
                        <ToggleButton value="cpp">C++</ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                        exclusive
                        value={orderType}
                        onChange={(event, newType) => {
                            if (newType !== null) {
                                setOrderType(newType);
                                setCurrentPage(1);
                            }
                        }}
                    >
                        <ToggleButton value="latest">最新发布</ToggleButton>
                        <ToggleButton value="popular">最受欢迎</ToggleButton>
                        <ToggleButton value="courses">随堂练习</ToggleButton>
                    </ToggleButtonGroup>
                </div>

                {works}
            </div>
        </AppLayout>
    );
}
