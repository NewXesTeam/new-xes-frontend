import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Container, Nav, Row, Col, Badge, Card } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';
import { CommentList, FollowList } from '@/components/MessageList';
import { Pagination } from '@/components/Pagination';
import { checkLoggedIn } from '@/utils';
import '@/styles/common.scss';
import { MessageData } from '@/interfaces/message';

const MessagePage = () => {
    if (!checkLoggedIn()) {
        location.href = '/login.html';
        return null;
    }

    const readMessages = async () => {
        const messageResponse = await fetch(`/api/messages/overview`);
        const messageResponseData: MessageData = await messageResponse.json();
        setMessageData(messageResponseData);
        setTotalMessageCount(messageResponseData.data.reduce((acc, cur) => acc + cur.count, 0));
    };

    let params = new URLSearchParams(location.search);
    const category: string = params.get('category');
    const [messages, setMessages] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

    const [currentTab, setCurrentTab] = React.useState(category);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [messageData, setMessageData] = React.useState<MessageData>(null);
    const [totalMessageCount, setTotalMessageCount] = React.useState(0);

    window.addEventListener('popstate', (event: PopStateEvent) => {
        setCurrentTab(event.state?.category || '1');
        setCurrentPage(1);
        readMessages();
    });

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
                    <Col xs={12} lg={2}>
                        <Card
                            className="shadow-sm"
                            style={{ position: 'sticky', top: '10px', height: 'fit-content', padding: '5px' }}
                        >
                            <h2>
                                消息中心
                                <Badge bg="danger" pill style={{ display: totalMessageCount ? 'inline' : 'none' }}>
                                    {totalMessageCount}
                                </Badge>
                            </h2>
                            <Nav
                                className="flex-column"
                                variant="pills"
                                defaultActiveKey={currentTab}
                                onSelect={(eventKey: string | null) => {
                                    if (eventKey !== currentTab) {
                                        history.pushState(
                                            {
                                                category: eventKey,
                                            },
                                            null,
                                            `/message.html?category=${eventKey}`,
                                        );
                                        document.documentElement.scrollTop = 0;
                                        setCurrentTab(eventKey);
                                        setCurrentPage(1);
                                    }
                                }}
                            >
                                <Nav.Item>
                                    <Nav.Link eventKey="1">
                                        评论和回复
                                        <Badge
                                            bg="danger"
                                            pill
                                            style={{ display: messageData?.data[0].count ? 'inline' : 'none' }}
                                        >
                                            {messageData?.data[0].count}
                                        </Badge>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="5">
                                        关注
                                        <Badge
                                            bg="danger"
                                            pill
                                            style={{ display: messageData?.data[2].count ? 'inline' : 'none' }}
                                        >
                                            {messageData?.data[2].count}
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
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(<MessagePage />);
} else {
    throw new Error('Cannot find dom element #app');
}
