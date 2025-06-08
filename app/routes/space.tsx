import * as React from 'react';
import { redirect } from 'react-router';
import { Tabs, Tab, Container, Stack, Card, Button, Nav, Form, Spinner } from 'react-bootstrap';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import NavbarComponent from '@/components/Navbar';
import WorkList from '@/components/WorkList';
import Avatar from '@/components/Avatar';
import { SmallWorkCard } from '@/components/WorkCard';
import { UserVerticalList, UserHorizontalList } from '@/components/UserList';
import { Pagination } from '@/components/Pagination';
import { v4 as generateUUID } from 'uuid';

import type { ErrorResponse } from '@/interfaces/common';
import type { UserInfo } from '@/interfaces/user';
import type { SpaceProfile, SpaceIndex, SpaceCover, SpaceWorks, SpaceSocial } from '@/interfaces/space';
import type { Route } from './+types/space';
import '@/styles/app.scss';

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

                        <h2 className="mt-2">
                            TA 的作品 <span style={{ fontSize: '16px' }}>({responseData.data.works.total})</span>
                        </h2>
                        <WorkList works={responseData.data.works.data} />

                        <h2 className="mt-2">
                            TA 的收藏 <span style={{ fontSize: '16px' }}>({responseData.data.favorites.total})</span>
                        </h2>
                        <WorkList works={responseData.data.favorites.data} />

                        <h2 className="mt-2">
                            TA 的粉丝 <span style={{ fontSize: '16px' }}>({responseData.data.fans.total})</span>
                        </h2>
                        <UserHorizontalList users={responseData.data.fans.data} />

                        <h2 className="mt-2">
                            TA 的关注 <span style={{ fontSize: '16px' }}>({responseData.data.follows.total})</span>
                        </h2>
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
        const [orderType, setOrderType] = React.useState('time');
        const [currentPage, setCurrentPage] = React.useState(1);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(
                    `/api/space/works?user_id=${userId}&page=${currentPage}&per_page=20&order_type=${orderType}`,
                );
                const responseData: SpaceWorks = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(<h2>暂无作品</h2>);
                }

                setPageComponent(
                    <>
                        <Nav
                            className="mb-2 right-padding"
                            variant="pills"
                            defaultActiveKey="time"
                            onSelect={(eventKey: string | null) => {
                                setOrderType(eventKey ?? 'latest');
                                setCurrentPage(1);
                            }}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="time">最新发布</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="likes">点赞最多</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="comments">评论最多</Nav.Link>
                            </Nav.Item>
                        </Nav>
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
        }, [currentPage, orderType]);

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

export async function loader({ request, params }: Route.LoaderArgs) {
    if (params.userId === 'my' && request.headers.get('Cookie')?.includes('is_login=1;')) {
        redirect('/login');
    }

    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
        userId: params.userId,
        tabName: params.tabName,
    };
}

export async function clientLoader({ serverLoader, params }: Route.ClientLoaderArgs) {
    const serverData = await serverLoader();

    let userId = params.userId;
    let navigation = false;

    if (params.userId === 'my') {
        const response = await fetch('/api/user/info');
        const responseData: UserInfo = await response.json();
        userId = responseData.data.id;
        navigation = true;
    }

    const spaceProfileResponse = await fetch(`/api/space/profile?user_id=${userId}`);
    const spaceProfileData: SpaceProfile = await spaceProfileResponse.json();

    return { ...serverData, userId, navigation, spaceProfileData };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
    return (
        <>
            <NavbarComponent />
            <Container className="mt-2">
                <Spinner />
                <span style={{ fontSize: '24px' }}>Loading...</span>
            </Container>
        </>
    );
}

export default function SpacePage({ loaderData }: Route.ComponentProps) {
    const userId = loaderData.userId;
    const spaceProfileData = loaderData.spaceProfileData;

    if (loaderData.navigation) {
        location.href = `/space/${userId}/${loaderData.tabName}`;
        return <HydrateFallback />;
    }

    const [tab, setTab] = React.useState(loaderData.tabName);
    const [userSignature, setUserSignature] = React.useState(spaceProfileData.data.signature);
    const [userFollowed, setUserFollowed] = React.useState(spaceProfileData.data.is_follow);

    const [signatureInputValue, setSignatureInputValue] = React.useState('');
    const [isChangingSignature, setIsChangingSignature] = React.useState(false);
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);

    const signatureInputRef = React.useRef<HTMLInputElement | null>(null);

    const onClickFollow = async () => {
        await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: userId, state: !userFollowed }),
        });
        setUserFollowed(!userFollowed);
        setAlerts([
            <AutoCloseAlert key={generateUUID().slice(0, 8)} severity="success">
                {userFollowed ? '取消关注成功' : '关注成功'}
            </AutoCloseAlert>,
            ...alerts,
        ]);
    };

    const handleChangeSignature = async () => {
        setIsChangingSignature(false);
        setSignatureInputValue('');

        const response = await fetch('/api/space/edit_signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ signature: signatureInputValue }),
        });
        if (response.ok) {
            setUserSignature(signatureInputValue);
            setAlerts([
                <AutoCloseAlert severity="success" key={generateUUID().slice(0, 8)}>
                    更改签名成功
                </AutoCloseAlert>,
                ...alerts,
            ]);
        } else {
            const responseData: ErrorResponse = await response.json();
            setAlerts([
                <AutoCloseAlert severity="error" key={generateUUID().slice(0, 8)}>
                    {responseData.message}
                </AutoCloseAlert>,
                ...alerts,
            ]);
        }
    };

    return (
        <>
            <NavbarComponent />

            <div className="alert-list">{alerts}</div>

            <Container>
                <Stack className="mt-5 mx-auto text-center" direction="horizontal">
                    <Stack
                        className="width-fit-content text-center"
                        direction="horizontal"
                        style={{ marginRight: 'auto' }}
                    >
                        <Avatar
                            name={spaceProfileData.data.realname}
                            avatarUrl={spaceProfileData.data.avatar_path}
                            size={128}
                        />
                        <div style={{ textAlign: 'left', marginLeft: '1rem' }}>
                            <div>
                                <span style={{ fontSize: '24px' }}>{spaceProfileData.data.realname}</span>
                                <span style={{ fontSize: '16px', color: 'var(--bs-secondary)' }}>({userId})</span>
                            </div>
                            {isChangingSignature ? (
                                <Form.Control
                                    type="text"
                                    value={signatureInputValue}
                                    onChange={event => setSignatureInputValue(event.target.value)}
                                    onKeyDown={event => {
                                        if (event.key === 'Enter') {
                                            handleChangeSignature();
                                        } else if (event.key === 'Escape') {
                                            setIsChangingSignature(false);
                                            setSignatureInputValue('');
                                        }
                                    }}
                                    onBlur={() => {
                                        handleChangeSignature();
                                    }}
                                    ref={signatureInputRef}
                                />
                            ) : (
                                <div>
                                    <span style={{ fontSize: '16px' }}>{userSignature}</span>
                                    {spaceProfileData.data.is_my && (
                                        <>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => {
                                                    setSignatureInputValue(userSignature);
                                                    setIsChangingSignature(true);
                                                    console.log(signatureInputRef.current);
                                                    signatureInputRef.current?.focus();
                                                    signatureInputRef.current?.select();
                                                }}
                                            >
                                                修改签名
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                            <span>
                                关注：{spaceProfileData.data.follows}&nbsp;&nbsp;&nbsp;&nbsp;粉丝：
                                {spaceProfileData.data.fans}
                            </span>
                        </div>
                    </Stack>
                    {!spaceProfileData.data.is_my && (
                        <Button
                            variant={(userFollowed ? 'outline-' : '') + 'secondary'}
                            onClick={() => onClickFollow()}
                            style={{ width: '124px' }}
                        >
                            {userFollowed ? '已关注' : '关注'}
                        </Button>
                    )}
                </Stack>
            </Container>

            <Tabs
                className="mt-5 justify-content-center"
                transition={false}
                activeKey={tab}
                onSelect={(eventKey: string | null) => {
                    if (eventKey) {
                        // location.href = `/space/${userId}/${eventKey}`;
                        history.pushState({ tab: eventKey }, '', `/space/${userId}/${eventKey}`);
                        setTab(eventKey);
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
}
