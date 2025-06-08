import * as React from 'react';
import { Container, Nav, Row, Col } from 'react-bootstrap';
import { Badge, Card } from '@mui/material';
import NavbarComponent from '@/components/Navbar';
import { CommentList, FollowList } from '@/components/MessageList';
import { Pagination } from '@/components/Pagination';

import type { MessageData } from '@/interfaces/message';
import type { Route } from './+types/message';

export async function loader({ request, params }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
        category: params.category_id,
    };
}

export default function MessagePage({ loaderData }: Route.ComponentProps) {
    if (!loaderData.isLoggedIn) {
        location.href = '/login';
        return null;
    }

    const readMessages = async () => {
        const messageResponse = await fetch(`/api/messages/overview`);
        const messageResponseData: MessageData = await messageResponse.json();
        setMessageData(messageResponseData);
    };

    const category: string = loaderData.category;
    const [messages, setMessages] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

    const [currentTab, setCurrentTab] = React.useState(category);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [messageData, setMessageData] = React.useState<MessageData | null>(null);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            console.log(currentTab, typeof currentTab);
            const response = await fetch(`/api/messages?category=${currentTab}&page=${currentPage}&per_page=10`);
            const responseData = await response.json();

            await readMessages();

            if (responseData.data['total'] === 0) {
                setMessages(<h3>暂无消息</h3>);
            }
            setMessages(
                <>
                    {currentTab === '1' && <CommentList messages={responseData} onRead={readMessages}></CommentList>}
                    {currentTab === '5' && <FollowList messages={responseData} onRead={readMessages}></FollowList>}
                    {responseData.data.total > 10 && (
                        <div style={{ width: '100%' }}>
                            <Pagination
                                pageCount={Math.ceil(responseData.data.total / 10)}
                                value={currentPage}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="mt-2 mx-auto width-fit-content"
                            />
                        </div>
                    )}
                </>,
            );
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [currentTab, currentPage]);

    return (
        <>
            <NavbarComponent />

            <Container className="mt-5">
                <Row className="mt-3">
                    <Col
                        xs={12}
                        lg={2}
                        style={{
                            position: 'sticky',
                            top: '10px',
                            height: 'fit-content',
                            marginBottom: '10px',
                            zIndex: 1,
                        }}
                    >
                        <Card className="shadow" style={{ padding: '5px' }}>
                            <h2>消息中心</h2>
                            <Nav
                                className="flex-column"
                                variant="pills"
                                defaultActiveKey={currentTab}
                                onSelect={(eventKey: string | null) => {
                                    if (eventKey !== currentTab && eventKey !== null) {
                                        // redirect(`/message/${eventKey}`);
                                        history.pushState({ category: eventKey }, '', `/message/${eventKey}`);
                                        document.documentElement.scrollTop = 0;
                                        setCurrentTab(eventKey);
                                        setCurrentPage(1);
                                    }
                                }}
                            >
                                <Nav.Item>
                                    <Nav.Link eventKey="1">
                                        <Badge color="error" badgeContent={messageData?.data[0].count}>
                                            评论和回复
                                        </Badge>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="5">
                                        <Badge color="error" badgeContent={messageData?.data[2].count}>
                                            关注
                                        </Badge>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card>
                    </Col>
                    <Col xs={12} lg={10}>
                        <h2>{['评论和回复', '', '', '', '关注'][parseInt(currentTab) - 1]}</h2>
                        {messages}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
