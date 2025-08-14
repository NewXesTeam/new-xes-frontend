import * as React from 'react';
import { AppBar, Avatar, Badge, Menu, MenuItem, IconButton, Divider, Button, Toolbar, Box } from '@mui/material';
import { NavLink } from 'react-router';
import SearchInput from '@/components/SearchInput';
import { checkLoggedIn } from '@/utils';

import type { UserInfo } from '@/interfaces/user';
import type { MessageData } from '@/interfaces/message';
import '@/styles/search.css';

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
                    <span>消息</span>
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
                <span>创作</span>
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

const AppNavbar = () => {
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
        <AppBar className="shadow" position="static">
            <div className="container mx-auto">
                <Toolbar>
                    <NavLink to="/" className="mr-2">
                        <span style={{ fontSize: '24px' }}>XesCoding</span>
                    </NavLink>

                    <Box className="me-auto flex gap-2">
                        <Button sx={{ display: 'block' }} onClick={() => (location.href = '/')}>
                            首页
                        </Button>

                        <Button sx={{ display: 'block' }} onClick={() => (location.href = '/discover')}>
                            发现
                        </Button>

                        <Button sx={{ display: 'block' }} onClick={() => (location.href = '/about')}>
                            关于
                        </Button>
                    </Box>

                    <Box className="ms-auto flex gap-2">
                        <SearchInput />

                        {userInfo ? (
                            <UserMenu
                                userInfo={userInfo}
                                messageData={messageData}
                                totalMessageCount={totalMessageCount}
                                onLogout={logoutEvent}
                            />
                        ) : (
                            <Button sx={{ display: 'block' }} onClick={() => (location.href = '/login')}>
                                登录
                            </Button>
                        )}

                        <CreateMenu />
                    </Box>
                </Toolbar>
            </div>
        </AppBar>
    );
};

export default AppNavbar;
