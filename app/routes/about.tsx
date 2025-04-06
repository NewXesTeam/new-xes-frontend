import * as React from 'react';
import { Container } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';

export default function AboutPage() {
    return (
        <>
            <NavbarComponent />
            <Container className="mt-5">
                <h1>关于 NewXesFrontend</h1>
                <p>没什么好关于的，就是一个《简单》的前端项目。</p>
                <p>
                    使用 React {React.version} 和 React Router 开发，使用 Bootstrap 作为 UI 框架，使用 Vite
                    作为打包框架。
                </p>
                <p>
                    代码仓库：
                    <a href="https://github.com/NewXesTeam/NewXesFrontend">NewXesTeam/NewXesFrontend</a>
                </p>
            </Container>
        </>
    );
}
