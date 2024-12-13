import React from "react";
import { createRoot } from "react-dom/client";
import { Carousel } from "react-bootstrap";
import NavbarComponent from "./components/navbar.jsx";
import FollowsWorkList from "./components/FollowsWorkList.jsx";
import "./styles/index.scss";

const IndexPage = () => {
    return (
        <div>
            <NavbarComponent />
            <Carousel className="m-auto mt-5 mb-5" interval={3500}>
                <Carousel.Item>
                    <a href="https://code.xueersi.com/home/project/detail?lang=scratch&pid=24831951&version=3.0&langType=scratch">
                        <img src="https://livefile.xesimg.com/programme/python_assets/2408b27e9c45a11098ddfd851844c4f1.png" className="d-block h-25" alt="ill" />
                    </a>
                </Carousel.Item>
                <Carousel.Item>
                    <a href="https://code.xueersi.com/search">
                        <img src="https://static0.xesimg.com/talcode/assets/home/banner/search_default.png" className="d-block h-25" alt="search" />
                    </a>
                </Carousel.Item>
                <Carousel.Item>
                    <a href="https://code.xueersi.com/event">
                        <img src="https://static0.xesimg.com/talcode/assets/home/banner/event_default.png" className="d-block h-25" alt="events" />
                    </a>
                </Carousel.Item>
            </Carousel>
            <FollowsWorkList />
        </div>
    );
}

const root = createRoot(document.getElementById("app"));
root.render(<IndexPage />);
