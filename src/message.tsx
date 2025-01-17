import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Container, Nav } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';
import { checkLoggedIn } from '@/utils';
import { CommentList, FollowList } from '@/components/MessageList';
import { ContentInfo } from './interfaces/message';
import { Pagination } from './components/Pagination';
import '@/styles/common.scss';

const MessagePage = () => {
    if (!checkLoggedIn()) {
        location.href = '/login.html';
        return null;
    }
    const [currentPage, setCurrentPage] = React.useState(1);
    const [messages, setMessages] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            let params = new URLSearchParams(location.search);
            const category: string = params.get('category');

            const response = await fetch(`/api/messages?category=${category}&page=${currentPage}&per_page=10`);
            const responseData = await response.json();
            // console.log(responseData);

            if (responseData.data['total'] === 0) {
                setMessages(<h2>暂无消息</h2>);
            }
            setMessages(
                <>
                    <Nav
                        className="mb-2 left-padding"
                        variant="pills"
                        defaultActiveKey={category}
                        onSelect={(eventKey: string | null) => {
                            if (eventKey !== category) {
                                params.set('category', eventKey);
                                location.search = params.toString();
                            }
                        }}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="1">评论和回复</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="5">关注</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {category === '1' && <CommentList messages={responseData}></CommentList>}
                    {category === '5' && <FollowList messages={responseData}></FollowList>}
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
    }, [currentPage]);

    return (
        <>
            <NavbarComponent />

            <Container className="mt-5">{messages}</Container>
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
