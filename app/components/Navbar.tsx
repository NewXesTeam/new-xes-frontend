import * as React from 'react';
import { Container, Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router';
import Avatar from './Avatar';
import SearchInput from './SearchInput';
import { checkLoggedIn, getUserId } from '@/utils';

import type { UserInfo } from '@/interfaces/user';
import type { MessageData } from '@/interfaces/message';
import logoImg from '@/static/logo.png';
import '@/styles/search.scss';

const NavbarComponent = () => {
    const [messageData, setMessageData] = React.useState<MessageData | null>(null);
    const [totalMessageCount, setTotalMessageCount] = React.useState(0);
    const [userComponent, setUserComponent] = React.useState<React.JSX.Element>(
        <>
            <NavLink className="nav-link" to="/login">
                登录
            </NavLink>
        </>,
    );

    const logoutEvent = async () => {
        await fetch('/passport/logout');
        location.reload();
    };

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            if (checkLoggedIn()) {
                const userId = getUserId();
                const response = await fetch('/api/user/info');
                const responseData: UserInfo = await response.json();

                if (!location.pathname.includes('message.html')) {
                    const messageResponse = await fetch(`/api/messages/overview`);
                    const messageResponseData: MessageData = await messageResponse.json();
                    setMessageData(messageResponseData);
                    setTotalMessageCount(messageResponseData.data.reduce((acc, cur) => acc + cur.count, 0));
                }

                setUserComponent(
                    <>
                        {!location.pathname.includes('message.html') && (
                            <NavDropdown
                                title={
                                    <>
                                        消息
                                        <Badge
                                            pill
                                            bg="danger"
                                            style={{ display: totalMessageCount ? 'inline' : 'none' }}
                                        >
                                            {totalMessageCount}
                                        </Badge>
                                    </>
                                }
                                align={'end'}
                            >
                                <NavLink className="dropdown-item" to="/message/1" target="_blank">
                                    评论和回复
                                    <Badge
                                        pill
                                        bg="danger"
                                        style={{ display: messageData?.data[0].count ? 'inline' : 'none' }}
                                    >
                                        {messageData?.data[0].count}
                                    </Badge>
                                </NavLink>
                                <NavLink className="dropdown-item" to="/message/5" target="_blank">
                                    关注
                                    <Badge
                                        pill
                                        bg="danger"
                                        style={{ display: messageData?.data[2].count ? 'inline' : 'none' }}
                                    >
                                        {messageData?.data[2].count}
                                    </Badge>
                                </NavLink>
                            </NavDropdown>
                        )}

                        <NavDropdown
                            title={
                                <Avatar
                                    name={responseData.data.name}
                                    avatarUrl={responseData.data.avatar_path}
                                    size={40}
                                />
                            }
                            align={'end'}
                        >
                            <NavLink className="dropdown-item" to={`/space/${userId}/home`} target="_blank">
                                个人空间
                            </NavLink>
                            <NavLink className="dropdown-item" to="/user" target="_blank">
                                作品管理
                            </NavLink>
                            <NavDropdown.Divider />
                            <NavLink className="dropdown-item" to="/userInfo" target="_blank">
                                个人信息
                            </NavLink>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logoutEvent}>登出</NavDropdown.Item>
                        </NavDropdown>
                    </>,
                );
            }
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow">
            <Container>
                <NavLink className="navbar-brand" to="/">
                    <img src={logoImg} width={190} height={37} alt="logo"></img>
                </NavLink>

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <NavLink className="nav-link" to="/">
                            主页
                        </NavLink>
                        <NavLink className="nav-link" to="/discover">
                            发现
                        </NavLink>
                        <NavLink className="nav-link" to="/about">
                            关于
                        </NavLink>
                    </Nav>

                    <Nav className="ms-auto" style={{ alignItems: 'center' }}>
                        <SearchInput />

                        {userComponent}

                        <NavDropdown title="创作" align={'end'}>
                            <NavDropdown.Item href="#">TurboWarp</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">Python 基础</NavDropdown.Item>
                            <NavDropdown.Item href="#">Python 海龟</NavDropdown.Item>
                            <NavDropdown.Item href="#">Python 本地</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">C++</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
