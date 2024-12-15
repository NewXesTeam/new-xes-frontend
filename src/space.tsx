import React from 'react';
import { createRoot } from 'react-dom/client';
import { Tabs, Tab, Container } from 'react-bootstrap';
import NavbarComponent from './components/Navbar.tsx';
import './styles/common.scss';

const HomeTab = () => {
    return (
        <Container>
            <h1>主页</h1>
        </Container>
    );
};

const CoverTab = () => {
    return (
        <Container>
            <h1>封面</h1>
        </Container>
    );
};

const ProjectsTab = () => {
    return (
        <Container>
            <h1>作品</h1>
        </Container>
    );
};

const FavoritesTab = () => {
    return (
        <Container>
            <h1>收藏</h1>
        </Container>
    );
};

const FansTab = () => {
    return (
        <Container>
            <h1>社交</h1>
        </Container>
    );
};

const UserPage = () => {
    return (
        <>
            <NavbarComponent />

            <Tabs className="mt-5 justify-content-center" transition={false}>
                <Tab eventKey="home" title="主页">
                    <HomeTab />
                </Tab>
                <Tab eventKey="cover" title="封面">
                    <CoverTab />
                </Tab>
                <Tab eventKey="projects" title="作品">
                    <ProjectsTab />
                </Tab>
                <Tab eventKey="favorites" title="收藏">
                    <FavoritesTab />
                </Tab>
                <Tab eventKey="fans" title="社交">
                    <FansTab />
                </Tab>
                {/* 不打算支持垃圾勋章 */}
            </Tabs>
        </>
    );
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(<UserPage />);
} else {
    throw new Error('Cannot find dom element #app');
}
