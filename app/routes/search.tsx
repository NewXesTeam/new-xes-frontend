import * as React from 'react';
import { Tab, Tabs, ToggleButton, ToggleButtonGroup, Container, Typography, Box } from '@mui/material';
import NavbarComponent from '@/components/Navbar';
import WorkList from '@/components/WorkList';
import { Pagination } from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import { UserAndWorkList } from '@/components/UserAndWorkList';

import type { Route } from './+types/search';

const SearchTabs = {
    AllTab: ({ keyword }: { keyword: string }) => {
        const [currentPage, setCurrentPage] = React.useState(1);
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(
            <Typography variant="h6">加载中...</Typography>,
        );

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                let response: Response;
                let responseData: any;
                if (currentPage === 1) {
                    response = await fetch(
                        `/api/search?keyword=${keyword}&search_type=all&page=${currentPage}&per_page=50`,
                    );
                    responseData = await response.json();
                } else {
                    response = await fetch(
                        `/api/search?keyword=${keyword}&search_type=works&order_type=comprehensive&lang=all&page=${currentPage}&per_page=50`,
                    );
                    responseData = await response.json();
                }
                if (responseData.data.total === 0) {
                    setPageComponent(<Typography variant="h6">暂无数据</Typography>);
                }

                setPageComponent(
                    <>
                        {currentPage === 1 && (
                            <>
                                <UserAndWorkList infos={responseData.data.users.data} />
                                <Box my={2} />
                                <WorkList works={responseData.data.works.data} />
                            </>
                        )}
                        {currentPage === 1 && responseData.data.works.total > 50 && (
                            <Box width="100%">
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.works.total / 50)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                    className="mt-2 mx-auto width-fit-content"
                                />
                            </Box>
                        )}

                        {currentPage > 1 && (
                            <>
                                <WorkList works={responseData.data.data} />
                            </>
                        )}
                        {currentPage > 1 && responseData.data.total > 50 && (
                            <Box width="100%">
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 50)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                    className="mt-2 mx-auto width-fit-content"
                                />
                            </Box>
                        )}
                    </>,
                );
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, [currentPage]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    AuthorTab: ({ keyword }: { keyword: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(
            <Typography variant="h6">加载中...</Typography>,
        );
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/search?keyword=${keyword}&search_type=users&page=${currentPage}&per_page=10`,
                );
                const responseData = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<Typography variant="h6">暂无数据</Typography>);
                }

                setPageComponent(
                    <>
                        <UserAndWorkList infos={responseData.data.data} />
                        {responseData.data.total > 10 && (
                            <Box width="100%">
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 10)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                    className="mt-2 mx-auto width-fit-content"
                                />
                            </Box>
                        )}
                    </>,
                );
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, [currentPage]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    ProjectsTab: ({ keyword }: { keyword: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(
            <Typography variant="h6">加载中...</Typography>,
        );
        const [orderType, setOrderType] = React.useState('comprehensive');
        const [lang, setLang] = React.useState('all');
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/search?keyword=${keyword}&search_type=works&order_type=${orderType}&lang=${lang}&page=${currentPage}&per_page=50`,
                );
                const responseData = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<Typography variant="h6">暂无作品</Typography>);
                    return;
                }

                setPageComponent(
                    <>
                        <Box className="d-flex justify-content-between" sx={{ padding: 1 }}>
                            <ToggleButtonGroup
                                className="left-padding"
                                value={lang}
                                exclusive
                                onChange={(event, newLang) => {
                                    if (newLang !== null) {
                                        setLang(newLang);
                                        setCurrentPage(1);
                                    }
                                }}
                            >
                                <ToggleButton value="all">全部</ToggleButton>
                                <ToggleButton value="scratch">TurboWarp</ToggleButton>
                                <ToggleButton value="python">Python</ToggleButton>
                                <ToggleButton value="cpp">C++</ToggleButton>
                            </ToggleButtonGroup>
                            <ToggleButtonGroup
                                className="right-padding"
                                value={orderType}
                                exclusive
                                onChange={(event, newOrderType) => {
                                    if (newOrderType !== null) {
                                        setOrderType(newOrderType);
                                        setCurrentPage(1);
                                    }
                                }}
                            >
                                <ToggleButton value="comprehensive">综合排序</ToggleButton>
                                <ToggleButton value="likes">点赞最多</ToggleButton>
                                <ToggleButton value="favorites">收藏最多</ToggleButton>
                                <ToggleButton value="source_code_views">改编最多</ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <WorkList works={responseData.data.data} />
                        {responseData.data.total > 50 && (
                            <Box width="100%">
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 50)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                    className="m-auto width-fit-content"
                                />
                            </Box>
                        )}
                    </>,
                );
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, [currentPage, lang, orderType]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
};

export async function loader({ request }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
        keyword: new URL(request.url).searchParams.get('keyword') || null,
        tab: new URL(request.url).searchParams.get('tab'),
    };
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
    const keyword = loaderData.keyword;
    // const tab = loaderData.tab || 'all';
    const [tab, setTab] = React.useState(loaderData.tab || 'all');

    if (keyword === null) {
        if (!loaderData.isLoggedIn) {
            location.href = '/login';
            return null;
        }
        return <Typography variant="h6">获取关键字失败</Typography>;
    }

    const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
        if (newTab) {
            // location.href = `/search?keyword=${decodeURIComponent(keyword)}&tab=${newTab}`;
            setTab(newTab);
            history.pushState(null, '', `/search?keyword=${decodeURIComponent(keyword)}&tab=${newTab}`);
        }
    };

    return (
        <>
            <NavbarComponent />

            <Container className="mt-5">
                <SearchInput keyword={keyword} />
            </Container>

            <Box className="mt-5 d-flex justify-content-center">
                <Tabs value={tab} onChange={handleTabChange}>
                    <Tab label="综合" value="all" className="mx-2" />
                    <Tab label="作者" value="users" className="mx-2" />
                    <Tab label="作品" value="projects" className="mx-2" />
                </Tabs>
            </Box>

            <Container className="mt-5">
                {tab === 'all' && <SearchTabs.AllTab keyword={keyword} />}
                {tab === 'users' && <SearchTabs.AuthorTab keyword={keyword} />}
                {tab === 'projects' && <SearchTabs.ProjectsTab keyword={keyword} />}
            </Container>
        </>
    );
}
