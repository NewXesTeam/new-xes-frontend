import * as React from 'react';
import { Container } from '@mui/material';
import AppLayout from '@/layout/AppLayout';

export default function AboutPage() {
    return (
        <AppLayout>
            <Container>
                <h1>关于 NewXesFrontend</h1>
                <p>没什么好关于的，就是一个《简单》的前端项目。</p>
                <p>
                    使用 React {React.version} 和 React Router 开发，使用 Tailwind CSS 作为 css 库，使用 @mui/material
                    作为 UI 库，使用 Vite 作为打包框架。
                </p>
                <p>
                    代码仓库：
                    <a href="https://github.com/NewXesTeam/NewXesFrontend">NewXesTeam/NewXesFrontend</a>
                </p>
            </Container>
        </AppLayout>
    );
}
