import React from 'react';
import { createRoot } from 'react-dom/client';

import { UserInfo } from './interfaces/user.ts';
import { SpaceProfile, SpaceIndex, SpaceCover } from './interfaces/space.ts';

import { Tabs, Tab, Container, Stack, Card } from 'react-bootstrap';
import NavbarComponent from './components/Navbar.tsx';
import WorkList from './components/WorkList.tsx';
import { SmallWorkCard } from './components/WorkCard.tsx';
import { UserHorizontalList } from './components/UserList.tsx';

import { checkLoggedIn } from './utils.ts';
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

                        <h2 className="mt-2">TA 的作品</h2>
                        <WorkList works={responseData.data.works.data} />

                        <h2 className="mt-2">TA 的收藏</h2>
                        <WorkList works={responseData.data.favorites.data} />

                        <h2 className="mt-2">TA 的粉丝</h2>
                        <UserHorizontalList users={responseData.data.fans.data} />

                        <h2 className="mt-2">TA 的关注</h2>
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
    ProjectsTab: () => {
        return (
            <Container>
                <h1>作品</h1>
            </Container>
        );
    },
    FavoritesTab: () => {
        return (
            <Container>
                <h1>收藏</h1>
            </Container>
        );
    },
    FansTab: () => {
        return (
            <Container>
                <h1>社交</h1>
            </Container>
        );
    },
};

const SpacePage = () => {
    const URLParams = new URLSearchParams(document.location.search);
    const userId = URLParams.get('id');

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

    const [username, setUsername] = React.useState('Loading...');
    const [userAvatar, setUserAvatar] = React.useState('https://t.100tal.com/avatar/');
    const [userSignature, setUserSignature] = React.useState('Loading...');
    const [userFollows, setUserFollows] = React.useState(0);
    const [userFans, setUserFans] = React.useState(0);

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
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            <NavbarComponent />

            <Stack className="mt-5 mx-auto width-fit-content text-center">
                <img className="rounded-circle mx-auto" src={userAvatar} height={128} width={128} />
                <span style={{ fontSize: '24px' }}>{username}</span>
                <span style={{ fontSize: '16px' }}>{userSignature}</span>
                <span>
                    关注：{userFollows}&nbsp;&nbsp;&nbsp;&nbsp;粉丝：{userFans}
                </span>
            </Stack>

            <Tabs className="mt-5 justify-content-center" transition={false}>
                <Tab eventKey="home" title="主页" mountOnEnter unmountOnExit>
                    <SpaceTabs.HomeTab userId={userId} />
                </Tab>
                <Tab eventKey="cover" title="封面" mountOnEnter unmountOnExit>
                    <SpaceTabs.CoverTab userId={userId} />
                </Tab>
                <Tab eventKey="projects" title="作品" mountOnEnter unmountOnExit>
                    <SpaceTabs.ProjectsTab />
                </Tab>
                <Tab eventKey="favorites" title="收藏" mountOnEnter unmountOnExit>
                    <SpaceTabs.FavoritesTab />
                </Tab>
                <Tab eventKey="fans" title="社交" mountOnEnter unmountOnExit>
                    <SpaceTabs.FansTab />
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
