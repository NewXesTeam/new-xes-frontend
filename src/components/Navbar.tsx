import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Form } from 'react-bootstrap';
import { checkLoggedIn } from '../utils.ts';
import Avatar from './Avatar.tsx';
import { UserInfo } from '../interfaces/user';

const NavbarComponent = () => {
    const logoutEvent = async () => {
        await fetch('/passport/logout');
        location.reload();
    };
    const [userName, setUserName] = React.useState<string>('');
    const [userAvatar, setUserAvatar] = React.useState<string>('');
    let userComponent: React.JSX.Element;

    if (checkLoggedIn()) {
        React.useEffect(() => {
            let ignore = false;
            const func = async () => {
                const response = await fetch('/api/user/info');
                const responseData: UserInfo = await response.json();
                setUserName(responseData.data.name);
                setUserAvatar(responseData.data.avatar_path);
            };

            if (!ignore) func();
            return () => {
                ignore = true;
            };
        }, []);
        userComponent = (
            <NavDropdown title={<Avatar name={userName} avatarUrl={userAvatar} size={40} />} align={'end'}>
                <NavDropdown.Item href="/space.html" target="_blank">
                    个人空间
                </NavDropdown.Item>
                <NavDropdown.Item href="/userInfo.html" target="_blank">
                    个人信息
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutEvent}>登出</NavDropdown.Item>
            </NavDropdown>
        );
    } else {
        userComponent = <Nav.Link href="/login.html">登录</Nav.Link>;
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow">
            <Container>
                <Navbar.Brand href="/">
                    <img src={require('../static/logo.png')} width={190} height={37} alt="logo"></img>
                </Navbar.Brand>

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link href="/">主页</Nav.Link>
                        <Nav.Link href="/discover.html">发现</Nav.Link>
                        <Nav.Link href="/about.html">关于</Nav.Link>
                    </Nav>

                    <Nav className="ms-auto" style={{ alignItems: 'center' }}>
                        <Form role="search" action="https://code.xueersi.com/search-center" className="me-2">
                            <Form.Control type="search" placeholder="搜索" className=" mr-sm-2" name="keyword" />
                        </Form>

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
