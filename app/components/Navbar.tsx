import * as React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Avatar, Badge, Menu, MenuItem, IconButton, Divider, Button } from '@mui/material';
import { NavLink } from 'react-router';
import SearchInput from './SearchInput';
import { checkLoggedIn } from '@/utils';

import type { UserInfo } from '@/interfaces/user';
import type { MessageData } from '@/interfaces/message';
import logoImg from '@/static/logo.png';
import '@/styles/search.scss';

const UserMenu = ({
    userInfo,
    messageData,
    totalMessageCount,
    onLogout,
}: {
    userInfo: UserInfo['data'];
    messageData: MessageData | null;
    totalMessageCount: number;
    onLogout: () => void;
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openUserMenu = Boolean(anchorEl);

    const [messageEl, setMessageEl] = React.useState<null | HTMLElement>(null);
    const openMessageMenu = Boolean(messageEl);

    return (
        <>
            <Button
                aria-controls={openMessageMenu ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMessageMenu ? 'true' : undefined}
                onClick={event => setMessageEl(event.currentTarget)}
            >
                <Badge color="error" badgeContent={totalMessageCount}>
                    消息
                </Badge>
            </Button>
            <Menu
                anchorEl={messageEl}
                open={openMessageMenu}
                onClose={() => setMessageEl(null)}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <MenuItem component={NavLink} to="/message/1">
                    <Badge color="error" badgeContent={messageData?.data[0].count}>
                        评论和回复
                    </Badge>
                </MenuItem>
                <MenuItem component={NavLink} to="/message/5">
                    <Badge color="error" badgeContent={messageData?.data[2].count}>
                        关注
                    </Badge>
                </MenuItem>
            </Menu>

            <IconButton
                aria-controls={openUserMenu ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openUserMenu ? 'true' : undefined}
                onClick={event => setAnchorEl(event.currentTarget)}
            >
                <Avatar alt={userInfo.name} src={userInfo.avatar_path} sx={{ width: 40, height: 40 }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={openUserMenu}
                onClose={() => setAnchorEl(null)}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <MenuItem component={NavLink} to={`/space/${userInfo.id}/home`}>
                    个人空间
                </MenuItem>
                <MenuItem component={NavLink} to="/user">
                    作品管理
                </MenuItem>
                <Divider />
                <MenuItem component={NavLink} to="/userInfo">
                    个人信息
                </MenuItem>
                <Divider />
                <MenuItem onClick={onLogout}>登出</MenuItem>
            </Menu>
        </>
    );
};

const CreateMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openCreateMenu = Boolean(anchorEl);

    return (
        <>
            <Button
                aria-controls={openCreateMenu ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openCreateMenu ? 'true' : undefined}
                onClick={event => setAnchorEl(event.currentTarget)}
            >
                创作
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={openCreateMenu}
                onClose={() => setAnchorEl(null)}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <MenuItem component={NavLink} to="#">
                    TurboWarp
                </MenuItem>
                <Divider />
                <MenuItem component={NavLink} to="#">
                    Python 基础
                </MenuItem>
                <MenuItem component={NavLink} to="#">
                    Python 海龟
                </MenuItem>
                <MenuItem component={NavLink} to="#">
                    Python 本地
                </MenuItem>
                <Divider />
                <MenuItem component={NavLink} to="#">
                    C++
                </MenuItem>
            </Menu>
        </>
    );
};

const NavbarComponent = () => {
    const [userInfo, setUserInfo] = React.useState<UserInfo['data'] | null>(null);
    const [messageData, setMessageData] = React.useState<MessageData | null>(null);
    const [totalMessageCount, setTotalMessageCount] = React.useState(0);

    const logoutEvent = async () => {
        await fetch('/passport/logout');
        location.reload();
    };

    React.useEffect(() => {
        const fetchData = async () => {
            if (checkLoggedIn()) {
                const response = await fetch('/api/user/info');
                const userData: UserInfo = await response.json();
                setUserInfo(userData.data);

                if (!location.pathname.includes('message.html')) {
                    const messageResponse = await fetch(`/api/messages/overview`);
                    const messageResponseData: MessageData = await messageResponse.json();
                    setMessageData(messageResponseData);
                    setTotalMessageCount(messageResponseData.data.reduce((acc, cur) => acc + cur.count, 0));
                }
            }
        };

        fetchData();
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

                        {userInfo ? (
                            <UserMenu
                                userInfo={userInfo}
                                messageData={messageData}
                                totalMessageCount={totalMessageCount}
                                onLogout={logoutEvent}
                            />
                        ) : (
                            <NavLink className="nav-link" to="/login">
                                登录
                            </NavLink>
                        )}

                        {/* <NavDropdown title="创作" align={'end'}>
                            <NavDropdown.Item href="#">TurboWarp</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">Python 基础</NavDropdown.Item>
                            <NavDropdown.Item href="#">Python 海龟</NavDropdown.Item>
                            <NavDropdown.Item href="#">Python 本地</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">C++</NavDropdown.Item>
                        </NavDropdown> */}
                        <CreateMenu />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
