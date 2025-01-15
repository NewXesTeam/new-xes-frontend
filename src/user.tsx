import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Container, Nav } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';
import '@/styles/index.scss';

const UserPage = () => {
    return (
        <>
            <NavbarComponent />
            <Container className="mt-5">
                <Nav className="mb-2" variant="pills" defaultActiveKey="normal">
                    <Nav.Item>
                        <Nav.Link eventKey="normal">个人创作</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="homework">隋唐（随堂）练习</Nav.Link>
                    </Nav.Item>
                </Nav>
                类型
                <Nav className="mb-2" defaultActiveKey="projects">
                    <Nav.Item>
                        <Nav.Link eventKey="projects">TurboWarp</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="python">Python</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="compilers">C++</Nav.Link>
                    </Nav.Item>
                </Nav>
                状态
                <Nav className="mb-2" defaultActiveKey="all">
                    <Nav.Item>
                        <Nav.Link eventKey="all">全部</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="0">未发布</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2">审核中</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="1">已发布</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="removed">已下架</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </>
    );
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(
        <React.StrictMode>
            <UserPage />
        </React.StrictMode>,
    );
} else {
    throw new Error('Cannot find dom element #app');
}
