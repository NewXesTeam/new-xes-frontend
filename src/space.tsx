import React from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs, Tab, Container, Stack } from 'react-bootstrap';
import { UserInfo } from './interfaces/user.ts';
import { SpaceProfile } from './interfaces/space.ts';
import { checkLoggedIn } from './utils.ts';
import NavbarComponent from './components/Navbar.tsx';
import './styles/common.scss';

const SpaceTabs = {
    HomeTab: () => {
        return (
            <Container>
                <h1>主页</h1>
            </Container>
        );
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

    if (userId === null && checkLoggedIn()) {
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
    } else {
        location.href = '/login.html';
        return null;
    }

    const [username, setUsername] = React.useState('Loading...');
    const [userAvatar, setUserAvatar] = React.useState('https://t.100tal.com/avatar/');
    const [userSignature, setUserSignature] = React.useState('Loading...');

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const spaceProfileResponse = await fetch(`/api/space/profile?user_id=${userId}`);
            const spaceProfileData: SpaceProfile = await spaceProfileResponse.json();

            setUsername(spaceProfileData.data.realname);
            setUserAvatar(spaceProfileData.data.avatar_path);
            setUserSignature(spaceProfileData.data.signature);
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
            </Stack>

            <Tabs className="mt-5 justify-content-center" transition={false}>
                <Tab eventKey="home" title="主页">
                    <SpaceTabs.HomeTab />
                </Tab>
                <Tab eventKey="cover" title="封面">
                    <SpaceTabs.CoverTab />
                </Tab>
                <Tab eventKey="projects" title="作品">
                    <SpaceTabs.ProjectsTab />
                </Tab>
                <Tab eventKey="favorites" title="收藏">
                    <SpaceTabs.FavoritesTab />
                </Tab>
                <Tab eventKey="fans" title="社交">
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
    root.render(<SpacePage />);
} else {
    throw new Error('Cannot find dom element #app');
}
