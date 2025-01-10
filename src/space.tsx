import React from 'react';
import { createRoot } from 'react-dom/client';
import { UserInfo, FollowUser } from './interfaces/user.ts';
import { SpaceProfile, SpaceIndex, SpaceCover, SpaceWorks, SpaceSocial } from './interfaces/space.ts';
import { Tabs, Tab, Container, Stack, Card, Button, Nav } from 'react-bootstrap';
import AutoCloseAlert from './components/AutoCloseAlert.tsx';
import NavbarComponent from './components/Navbar.tsx';
import WorkList from './components/WorkList.tsx';
import Avatar from './components/Avatar.tsx';
import { SmallWorkCard } from './components/WorkCard.tsx';
import { UserVerticalList, UserHorizontalList } from './components/UserList.tsx';
import { Pagination } from './components/Pagination.tsx';
import { checkLoggedIn } from './utils.ts';
import { v4 as generateUUID } from 'uuid';
import './styles/common.scss';

const SpaceTabs = {
    HomeTab: ({ userId }: { userId: string }) => {
        const OverviewItemCard = ({ title, value }: { title: string; value: number }) => {
            return (
                <Card border="secondary" className="m-auto" body>
                    {title}：
                    <br />
                    <span style={{ fontSize: '24px' }}>{value}</span>
                </Card>
            );
        };

        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(`/api/space/index?user_id=${userId}`);
                const responseData: SpaceIndex = await response.json();

                setPageComponent(
                    <>
                        <Card>
                            <Card.Header>
                                <h4>Ta 的成就</h4>
                            </Card.Header>
                            <Card.Body>
                                <Stack direction="horizontal">
                                    <OverviewItemCard title="作品总数" value={responseData.data.overview.works} />
                                    <OverviewItemCard title="被点赞总数" value={responseData.data.overview.likes} />
                                    <OverviewItemCard title="被浏览总数" value={responseData.data.overview.views} />
                                    <OverviewItemCard
                                        title="被改编总数"
                                        value={responseData.data.overview.source_code_views}
                                    />
                                    <OverviewItemCard title="被收藏总数" value={responseData.data.overview.favorites} />
                                    <Card border="secondary" body>
                                        代表作：
                                        <br />
                                        {responseData.data.representative_work ? (
                                            <SmallWorkCard work={responseData.data.representative_work} />
                                        ) : (
                                            '暂无代表作'
                                        )}
                                    </Card>
                                </Stack>
                            </Card.Body>
                        </Card>

                        <h2 className="mt-2">TA 的作品 <span style={{ fontSize: '16px' }}>({responseData.data.works.total})</span></h2>
                        <WorkList works={responseData.data.works.data} />

                        <h2 className="mt-2">TA 的收藏 <span style={{ fontSize: '16px' }}>({responseData.data.favorites.total})</span></h2>
                        <WorkList works={responseData.data.favorites.data} />

                        <h2 className="mt-2">TA 的粉丝 <span style={{ fontSize: '16px' }}>({responseData.data.fans.total})</span></h2>
                        <UserHorizontalList users={responseData.data.fans.data} />

                        <h2 className="mt-2">TA 的关注 <span style={{ fontSize: '16px' }}>({responseData.data.follows.total})</span></h2>
                        <UserHorizontalList users={responseData.data.follows.data} />
                    </>,
                );
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, []);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    CoverTab: ({ userId }: { userId: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(`/api/space/web_cover?user_id=${userId}`);
                const responseData: SpaceCover = await response.json();

                if (responseData.data.is_show_web_tab) {
                    setPageComponent(<iframe src={responseData.data.index_url} width="100%" height={600} />);
                } else {
                    setPageComponent(<h2>未设置封面</h2>);
                }
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, []);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    ProjectsTab: ({ userId }: { userId: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/space/works?user_id=${userId}&page=${currentPage}&per_page=20&order_type=time`,
                );
                const responseData: SpaceWorks = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<h2>暂无作品</h2>);
                }

                setPageComponent(
                    <>
                        <WorkList works={responseData.data.data} />
                        {responseData.data.total > 20 && (
                            <div style={{ width: '100%' }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 20)}
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
        }, [currentPage]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    FavoritesTab: ({ userId }: { userId: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/space/favorites?user_id=${userId}&page=${currentPage}&per_page=20&order_type=time`,
                );
                const responseData: SpaceWorks = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<h2>暂无作品</h2>);
                }

                setPageComponent(
                    <>
                        <WorkList works={responseData.data.data} />
                        {responseData.data.total > 20 && (
                            <div style={{ width: '100%' }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 20)}
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
        }, [currentPage]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    SocialTab: ({ userId }: { userId: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);
        const [currentTab, setCurrentTab] = React.useState('follows');
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/space/${currentTab}?user_id=${userId}&page=${currentPage}&per_page=10`,
                );
                const responseData: SpaceSocial = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<h2>暂无数据</h2>);
                }

                setPageComponent(
                    <>
                        <UserVerticalList users={responseData.data.data} />
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
        }, [currentTab, currentPage]);

        return (
            <Container className="mt-2">
                <Nav
                    className="mb-2"
                    variant="pills"
                    defaultActiveKey="follows"
                    onSelect={(eventKey: string | null) => setCurrentTab(eventKey || 'follows')}
                >
                    <Nav.Item>
                        <Nav.Link eventKey="follows">TA 的关注</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="fans">TA 的粉丝</Nav.Link>
                    </Nav.Item>
                </Nav>
                {pageComponent}
            </Container>
        );
    },
};

const SpacePage = () => {
    const URLParams = new URLSearchParams(document.location.search);
    const userId = URLParams.get('id');
    const [tab, setTab] = React.useState(URLParams.get('tab') || 'home');

    if (userId === null) {
        if (!checkLoggedIn()) {
            location.href = '/login.html';
            return null;
        }

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch('/api/user/info');
                const responseData: UserInfo = await response.json();
                let userId = responseData.data.id;
                location.href = `/space.html?id=${userId}`;
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, []);

        return <div />;
    }

    window.addEventListener('popstate', (event: PopStateEvent) => {
        setTab(event.state?.tab || 'home');
    });

    const [username, setUsername] = React.useState('Loading...');
    const [userAvatar, setUserAvatar] = React.useState('https://t.100tal.com/avatar/');
    const [userSignature, setUserSignature] = React.useState('Loading...');
    const [userFollows, setUserFollows] = React.useState(0);
    const [userFans, setUserFans] = React.useState(0);
    const [userFollowed, setUserFollowed] = React.useState(false);
    const [isMySpace, setIsMySpace] = React.useState(true);
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);

    const onClickFollow = async () => {
        const response = await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: '30883073', state: !userFollowed }),
        });
        const responseData: FollowUser = await response.json();
        setUserFollowed(!userFollowed);
        setAlerts([
            <AutoCloseAlert key={generateUUID().slice(0, 8)} variant="success">
                {userFollowed ? '取消关注成功' : '关注成功'}
            </AutoCloseAlert>,
            ...alerts,
        ]);
    };

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const spaceProfileResponse = await fetch(`/api/space/profile?user_id=${userId}`);
            const spaceProfileData: SpaceProfile = await spaceProfileResponse.json();

            setUsername(spaceProfileData.data.realname);
            setUserAvatar(spaceProfileData.data.avatar_path);
            setUserSignature(spaceProfileData.data.signature);
            setUserFollows(spaceProfileData.data.follows);
            setUserFans(spaceProfileData.data.fans);
            setUserFollowed(spaceProfileData.data.is_follow);
            setIsMySpace(spaceProfileData.data.is_my);
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            <NavbarComponent />

            <div className="alert-list">{alerts}</div>

            <Stack className="mt-5 mx-auto width-fit-content text-center">
                <Avatar name={username} avatarUrl={userAvatar} size={128} />
                <span style={{ fontSize: '24px' }}>{username}</span>
                <span style={{ fontSize: '16px' }}>{userSignature}</span>
                <span>
                    关注：{userFollows}&nbsp;&nbsp;&nbsp;&nbsp;粉丝：{userFans}
                </span>
                {!isMySpace && (
                    <Button
                        variant={(userFollowed ? 'outline-' : '') + 'secondary'}
                        onClick={() => onClickFollow()}
                        style={{ width: '124px' }}
                        className="mx-auto"
                    >
                        {userFollowed ? '已关注' : '关注'}
                    </Button>
                )}
            </Stack>

            <Tabs
                className="mt-5 justify-content-center"
                transition={false}
                activeKey={tab}
                onSelect={(eventKey: string | null) => {
                    if (eventKey) {
                        // location.href = `/space.html?id=${userId}&tab=${eventKey}`;
                        setTab(eventKey);
                        history.pushState({ tab: eventKey }, '', `/space.html?id=${userId}&tab=${eventKey}`);
                    }
                }}
            >
                <Tab eventKey="home" title="主页" mountOnEnter unmountOnExit>
                    <SpaceTabs.HomeTab userId={userId} />
                </Tab>
                <Tab eventKey="cover" title="封面" mountOnEnter unmountOnExit>
                    <SpaceTabs.CoverTab userId={userId} />
                </Tab>
                <Tab eventKey="projects" title="作品" mountOnEnter unmountOnExit>
                    <SpaceTabs.ProjectsTab userId={userId} />
                </Tab>
                <Tab eventKey="favorites" title="收藏" mountOnEnter unmountOnExit>
                    <SpaceTabs.FavoritesTab userId={userId} />
                </Tab>
                <Tab eventKey="social" title="社交" mountOnEnter unmountOnExit>
                    <SpaceTabs.SocialTab userId={userId} />
                </Tab>
                {/* 不打算支持垃圾勋章 */}
            </Tabs>
        </>
    );
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(
        <React.StrictMode>
            <SpacePage />
        </React.StrictMode>,
    );
} else {
    throw new Error('Cannot find dom element #app');
}
