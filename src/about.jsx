import React from "react";
import { createRoot } from "react-dom/client";
import { Container } from "react-bootstrap";
import NavbarComponent from "./components/navbar.jsx";
import "./styles/common.scss";

const AboutPage = () => {
    return (
        <div>
            <NavbarComponent />
            <Container className="mt-5">
                <h1>关于 NewXesFrontend</h1>
                <p>没什么好关于的，就是一个《简单》的前端项目。</p>
                <p>使用 React {React.version} 开发，使用 Bootstrap 作为 UI 框架。</p>
                <p>代码仓库：<a href="https://github.com/NewXesTeam/NewXesFrontend">NewXesTeam/NewXesFrontend</a></p>
            </Container>
        </div>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<AboutPage />);
