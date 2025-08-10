import * as React from 'react';
import { redirect } from 'react-router';
import {
    Avatar,
    Box,
    Button,
    Container,
    Card,
    CardContent,
    CircularProgress,
    Tabs,
    Tab,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    CardHeader,
    Stack,
    TextField,
} from '@mui/material';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import AppLayout from '@/layout/AppLayout';
import WorkList from '@/components/WorkList';
import { SmallWorkCard } from '@/components/WorkCard';
import { UserVerticalList, UserHorizontalList } from '@/components/UserList';
import { Pagination } from '@/components/Pagination';
import { v4 as generateUUID } from 'uuid';

import type { ErrorResponse } from '@/interfaces/common';
import type { UserInfo } from '@/interfaces/user';
import type { SpaceProfile, SpaceIndex, SpaceCover, SpaceWorks, SpaceSocial } from '@/interfaces/space';
import type { Route } from './+types/space';
import '@/styles/app.css';
import { useState } from 'react';

const SpaceTabs = {
    HomeTab: ({ userId }: { userId: string }) => {
        const OverviewItemCard = ({ title, value }: { title: string; value: number }) => {
            return (
                <Card variant="outlined" className="w-fit h-fit p-2 pr-6">
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

                if (ignore) return;
                setPageComponent(
                    <>
                        <Card variant="outlined" sx={{ my: 2 }}>
                            <CardHeader title="Ta 的成就" />
                            <CardContent>
                                <div className="flex gap-4 mx-auto w-fit">
                                    <OverviewItemCard title="作品总数" value={responseData.data.overview.works} />
                                    <OverviewItemCard title="被点赞总数" value={responseData.data.overview.likes} />
                                    <OverviewItemCard title="被浏览总数" value={responseData.data.overview.views} />
                                    <OverviewItemCard
                                        title="被改编总数"
                                        value={responseData.data.overview.source_code_views}
                                    />
                                    <OverviewItemCard title="被收藏总数" value={responseData.data.overview.favorites} />
                                    <Card variant="outlined" sx={{ padding: 1 }}>
                                        <Typography variant="h5">代表作</Typography>
                                        <br />
                                        {responseData.data.representative_work ? (
                                            <SmallWorkCard work={responseData.data.representative_work} />
                                        ) : (
                                            '暂无代表作'
                                        )}
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                <Typography variant="h5">
                                    TA 的作品{' '}
                                    <span style={{ fontSize: '16px' }}>({responseData.data.works.total})</span>
                                </Typography>
                                <WorkList works={responseData.data.works.data} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Typography variant="h5">
                                    TA 的收藏{' '}
                                    <span style={{ fontSize: '16px' }}>({responseData.data.favorites.total})</span>
                                </Typography>
                                <WorkList works={responseData.data.favorites.data} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Typography variant="h5">
                                    TA 的粉丝 <span style={{ fontSize: '16px' }}>({responseData.data.fans.total})</span>
                                </Typography>
                                <UserHorizontalList users={responseData.data.fans.data} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Typography variant="h5">
                                    TA 的关注{' '}
                                    <span style={{ fontSize: '16px' }}>({responseData.data.follows.total})</span>
                                </Typography>
                                <UserHorizontalList users={responseData.data.follows.data} />
                            </div>
                        </div>
                    </>,
                );
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, [userId]);

        return <Container className="mt-2">{pageComponent}</Container>;
    },
    CoverTab: ({ userId }: { userId: string }) => {
        const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

        React.useEffect(() => {
            let ignore = false;

            const func = async () => {
                const response = await fetch(`/api/space/web_cover?user_id=${userId}`);
                const responseData: SpaceCover = await response.json();

                if (ignore) return;
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
        }, [userId]);

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

                if (ignore) return;
                if (responseData.data.total === 0) {
                    setPageComponent(<h2>暂无作品</h2>);
                }

                setPageComponent(
                    <>
                        <WorkList works={responseData.data.data} />
                        {responseData.data.total > 20 && (
                            <div className="w-full mt-2">
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 20)}
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
        }, [userId, currentPage, orderType]);

        return (
            <Container>
                <ToggleButtonGroup
                    className="mb-2 right-padding"
                    exclusive
                    value={orderType}
                    onChange={(event, newType) => {
                        if (newType !== null) {
                            setOrderType(newType);
                            setCurrentPage(1);
                        }
                    }}
                >
                    <ToggleButton value="time">最新发布</ToggleButton>
                    <ToggleButton value="likes">点赞最多</ToggleButton>
                    <ToggleButton value="comments">评论最多</ToggleButton>
                </ToggleButtonGroup>
                {pageComponent}
            </Container>
        );
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

                if (ignore) return;
                if (responseData.data.total === 0) {
                    setPageComponent(<h2>暂无作品</h2>);
                }

                setPageComponent(
                    <>
                        <WorkList works={responseData.data.data} />
                        {responseData.data.total > 20 && (
                            <div className="w-full mt-2">
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 20)}
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
        }, [userId, currentPage]);

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

                if (ignore) return;
                if (responseData.data.total === 0) {
                    setPageComponent(<h2>暂无数据</h2>);
                }

                setPageComponent(
                    <>
                        <UserVerticalList users={responseData.data.data} />
                        {responseData.data.total > 10 && (
                            <div className="w-full mt-2">
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 10)}
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
        }, [userId, currentTab, currentPage]);

        return (
            <Container className="mt-2">
                <ToggleButtonGroup
                    className="mb-2 right-padding"
                    exclusive
                    value={currentTab}
                    onChange={(event, newTab) => {
                        if (newTab !== null) {
                            setCurrentTab(newTab);
                            setCurrentPage(1);
                        }
                    }}
                >
                    <ToggleButton value="follows">TA 的关注</ToggleButton>
                    <ToggleButton value="fans">TA 的粉丝</ToggleButton>
                </ToggleButtonGroup>
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
        <AppLayout>
            <Container className="flex items-center gap-2">
                <CircularProgress />
                <span style={{ fontSize: '30px' }}>Loading...</span>
            </Container>
        </AppLayout>
    );
}

export default function SpacePage({ loaderData }: Route.ComponentProps) {
    const spaceProfileData = loaderData.spaceProfileData;
    const userId = loaderData.userId;

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
            <div className="alert-list">{alerts}</div>
            <AppLayout>
                <Container>
                    <Stack className="mt-5 mx-auto text-center" spacing={2} direction="column">
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ maxWidth: 1 }}
                            className="text-center"
                            justifyContent="space-between"
                        >
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    sx={{ width: 128, height: 128 }}
                                    alt={spaceProfileData.data.realname}
                                    src={spaceProfileData.data.avatar_path}
                                />
                                <div style={{ textAlign: 'left' }}>
                                    <Typography variant="h5" component="div">
                                        {spaceProfileData.data.realname}
                                        <Typography variant="body1" component="span" color="text.secondary">
                                            ({userId})
                                        </Typography>
                                    </Typography>
                                    {isChangingSignature ? (
                                        <TextField
                                            variant="outlined"
                                            size="small"
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
                                            inputRef={signatureInputRef}
                                            sx={{ mt: 1, width: '100%' }}
                                        />
                                    ) : (
                                        <div>
                                            <Typography variant="body1" component="span">
                                                {userSignature}
                                            </Typography>
                                            {spaceProfileData.data.is_my && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => {
                                                        setSignatureInputValue(userSignature);
                                                        setIsChangingSignature(true);
                                                        signatureInputRef.current?.focus();
                                                        signatureInputRef.current?.select();
                                                    }}
                                                    sx={{ ml: 1 }}
                                                >
                                                    修改签名
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                    <Typography variant="body1" component="span" sx={{ mt: 1 }}>
                                        关注：{spaceProfileData.data.follows} &nbsp; 粉丝：{spaceProfileData.data.fans}
                                    </Typography>
                                </div>
                            </Stack>
                            {!spaceProfileData.data.is_my && (
                                <Button
                                    variant={userFollowed ? 'outlined' : 'contained'}
                                    color={userFollowed ? 'secondary' : 'primary'}
                                    onClick={() => onClickFollow()}
                                    sx={{ mt: 2, textAlign: 'right', width: 124 }}
                                >
                                    {userFollowed ? '已关注' : '关注'}
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </Container>

                <Box className="mt-5 flex justify-center">
                    <Tabs
                        value={tab}
                        onChange={(event, value) => {
                            if (value) {
                                history.pushState({ tab: value }, '', `/space/${userId}/${value}`);
                                setTab(value);
                            }
                        }}
                    >
                        <Tab value="home" label="主页" />
                        <Tab value="cover" label="封面" />
                        <Tab value="projects" label="作品" />
                        <Tab value="favorites" label="收藏" />
                        <Tab value="social" label="社交" />
                    </Tabs>
                </Box>

                <div className="mt-5 m-4">
                    {tab === 'home' && <SpaceTabs.HomeTab userId={userId} />}
                    {tab === 'cover' && <SpaceTabs.CoverTab userId={userId} />}
                    {tab === 'projects' && <SpaceTabs.ProjectsTab userId={userId} />}
                    {tab === 'favorites' && <SpaceTabs.FavoritesTab userId={userId} />}
                    {tab === 'social' && <SpaceTabs.SocialTab userId={userId} />}
                </div>
            </AppLayout>
        </>
    );
}
