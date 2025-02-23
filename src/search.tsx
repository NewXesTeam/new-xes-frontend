import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs, Tab, Container, Stack, Card, OverlayTrigger, Tooltip, Nav } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';
import WorkList from '@/components/WorkList';
import { Pagination } from '@/components/Pagination';
import { checkLoggedIn, getWorkLink } from '@/utils';
import { Work } from '@/interfaces/work';
import '@/styles/common.scss';
import SearchInput from '@/components/SearchInput';
import { UserAndWorkList } from './components/UserAndWorkList';

const FixedWorkCard = ({ work }: { work: Work }) => {
    let link = getWorkLink(work);
    let author_url = `/space.html?id=${work.user_id}`;

    return (
        <OverlayTrigger overlay={<Tooltip>{work.published_at}</Tooltip>}>
            <Card className="mb-3">
                <img
                    src={
                        work.thumbnail ||
                        'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                    }
                    className="card-img-top"
                    alt={work.name}
                    width={224}
                    height={168}
                />

                <Card.Body>
                    <Card.Title>
                        <a href={link} className="text-decoration-none stretched-link" target="_blank">
                            {work.name.replace(/<em>|<\/em>/g, '')}
                        </a>
                    </Card.Title>
                    <Card.Text className="d-flex justify-content-between align-items-center">
                        <a href={author_url} target="_blank" style={{ maxWidth: '114px', zIndex: 2 }}>
                            <span style={{ fontSize: '14px' }}>{work.username}</span>
                        </a>
                        <span style={{ fontSize: '12px' }}>
                            👀{work.views} 👍{work.likes} 👎{work.unlikes} 💬{work.comments}
                        </span>
                    </Card.Text>
                </Card.Body>
            </Card>
        </OverlayTrigger>
    );
};

const SpaceTabs = {
    AllTab: ({ keyword }: { keyword: string }) => {
        const [currentPage, setCurrentPage] = React.useState(1);
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

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
                    setPageComponent(<h2>暂无数据</h2>);
                }

                setPageComponent(
                    <>
                        {currentPage === 1 && (
                            <>
                                <UserAndWorkList infos={responseData.data.users.data} />
                                <WorkList works={responseData.data.works.data} WorkCardInterface={FixedWorkCard} />
                            </>
                        )}
                        {currentPage === 1 && responseData.data.works.total > 50 && (
                            <div style={{ width: '100%' }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.works.total / 50)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                    className="mt-2 mx-auto width-fit-content"
                                />
                            </div>
                        )}

                        {currentPage > 1 && (
                            <>
                                <WorkList works={responseData.data.data} WorkCardInterface={FixedWorkCard} />
                            </>
                        )}
                        {currentPage > 1 && responseData.data.total > 50 && (
                            <div style={{ width: '100%' }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 50)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                    className="mt-2 mx-auto width-fit-content"
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
        }, [currentPage]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    AuthorTab: ({ keyword }: { keyword: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/search?keyword=${keyword}&search_type=users&page=${currentPage}&per_page=10`,
                );
                const responseData = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<h2>暂无数据</h2>);
                }

                setPageComponent(
                    <>
                        <UserAndWorkList infos={responseData.data.data} />
                        {responseData.data.total > 10 && (
                            <div style={{ width: '100%' }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 10)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                    className="mt-2 mx-auto width-fit-content"
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
        }, [currentPage]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    ProjectsTab: ({ keyword }: { keyword: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);
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
                    setPageComponent(<h2>暂无作品</h2>);
                    return;
                }

                setPageComponent(
                    <>
                        <div className="d-flex justify-content-between">
                            <Nav
                                className="mb-2 left-padding"
                                variant="pills"
                                defaultActiveKey="all"
                                onSelect={(eventKey: string | null) => {
                                    if (eventKey !== lang) {
                                        setLang(eventKey ?? 'all');
                                        setCurrentPage(1);
                                    }
                                }}
                            >
                                <Nav.Item>
                                    <Nav.Link eventKey="all">全部</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="scratch">TurboWarp</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="python">Python</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="cpp">C++</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Nav
                                className="mb-2 right-padding"
                                variant="pills"
                                defaultActiveKey="comprehensive"
                                onSelect={(eventKey: string | null) => {
                                    setOrderType(eventKey ?? 'comprehensive');
                                    setCurrentPage(1);
                                }}
                            >
                                <Nav.Item>
                                    <Nav.Link eventKey="comprehensive">综合排序</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="likes">点赞最多</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="favorites">收藏最多</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="source_code_views">改编最多</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>

                        <WorkList works={responseData.data.data} WorkCardInterface={FixedWorkCard} />
                        {responseData.data.total > 50 && (
                            <div style={{ width: '100%' }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 50)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                    className="m-auto width-fit-content"
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
        }, [currentPage, lang, orderType]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
};

const SearchPage = () => {
    const URLParams = new URLSearchParams(document.location.search);
    const keyword = URLParams.get('keyword');
    const [tab, setTab] = React.useState(URLParams.get('tab') || 'all');

    if (keyword === null) {
        if (!checkLoggedIn()) {
            location.href = '/login.html';
            return null;
        }
        return <h2>获取关键字失败</h2>;
    }

    window.addEventListener('popstate', (event: PopStateEvent) => {
        setTab(event.state?.tab || 'all');
    });

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            // 等下填写
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            <NavbarComponent />

            <Container className="mt-2">
                <SearchInput keyword={keyword} />
            </Container>

            <Tabs
                className="mt-5 justify-content-center"
                transition={false}
                activeKey={tab}
                onSelect={(eventKey: string | null) => {
                    if (eventKey) {
                        // location.href = `/space.html?id=${userId}&tab=${eventKey}`;
                        setTab(eventKey);
                        history.pushState({ tab: eventKey }, '', `/search.html?keyword=${keyword}&tab=${eventKey}`);
                    }
                }}
            >
                <Tab eventKey="all" title="综合" mountOnEnter unmountOnExit>
                    <SpaceTabs.AllTab keyword={keyword} />
                </Tab>
                <Tab eventKey="users" title="作者" mountOnEnter unmountOnExit>
                    <SpaceTabs.AuthorTab keyword={keyword} />
                </Tab>
                <Tab eventKey="projects" title="作品" mountOnEnter unmountOnExit>
                    <SpaceTabs.ProjectsTab keyword={keyword} />
                </Tab>
                {/* 不打算支持垃圾视频 */}
            </Tabs>
        </>
    );
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(
        <React.StrictMode>
            <SearchPage />
        </React.StrictMode>,
    );
} else {
    throw new Error('Cannot find dom element #app');
}
