import React from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs, Tab, Container, Stack, Card } from 'react-bootstrap';
import NavbarComponent from './components/Navbar.tsx';
import { UserInfo } from './interfaces/user.ts';
import { SpaceProfile, SpaceIndex } from './interfaces/space.ts';
import { checkLoggedIn, getWorkLink } from './utils.ts';
import './styles/common.scss';

const SpaceTabs = {
    HomeTab: ({ userId }: { userId: string }) => {
        const OverviewItemCard = ({ title, value }: { title: string; value: number }) => {
            return (
                <Card border="dark" className="m-auto" body>
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

                                    <Card border="dark" className="m-auto" body>
                                        代表作：
                                        <br />
                                        {responseData.data.representative_work ? (
                                            <Card>
                                                <Card.Header>
                                                    <a
                                                        href={getWorkLink(responseData.data.representative_work)}
                                                        className="stretched-link"
                                                    >
                                                        {responseData.data.representative_work.name}
                                                    </a>
                                                </Card.Header>
                                                <Card.Body className="py-0">
                                                    <img
                                                        src={responseData.data.representative_work.thumbnail}
                                                        height={138}
                                                        className="m-auto"
                                                    />
                                                </Card.Body>
                                            </Card>
                                        ) : (
                                            '暂无代表作'
                                        )}
                                    </Card>
                                </Stack>
                            </Card.Body>
                        </Card>
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
    CoverTab: () => {
        return (
            <Container>
                <h1>封面</h1>
            </Container>
        );
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
    let URLParams = new URLSearchParams(document.location.search);
    let userId = URLParams.get('id');

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
                userId = responseData.data.id;
                location.href = `/space.html?id=${userId}`;
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, []);

        return <div />; // 额，这是为了避免用户看到提示语感觉不舒服所以才不加任何内容
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
                    <SpaceTabs.CoverTab />
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
