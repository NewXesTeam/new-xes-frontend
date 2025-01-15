import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Container, Nav, Card, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';
import WorkList from '@/components/WorkList';
import { Pagination } from '@/components/Pagination';
import { UserWorkList } from '@/interfaces/user';
import { Work } from '@/interfaces/work';
import { getWorkLink, getEditWorkLink } from '@/utils';
import '@/styles/user.scss';

const FixedWorkCard = ({ work }: { work: Work }) => {
    const publishedText = { 0: '未发布', 1: '已发布', 2: '审核中', removed: '已下架' };
    const [isShowOperators, setIsShowOperators] = React.useState(false);
    let link = getWorkLink(work);
    let editLink = getEditWorkLink(work);

    return (
        <OverlayTrigger
            overlay={<Tooltip>{work.created_at}</Tooltip>}
            onToggle={(value) => setIsShowOperators(value)}
        >
            <div style={{ position: 'relative' }} className="mb-3">
                <Card>
                    <img
                        src={
                            work.thumbnail ||
                            'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                        }
                        className="card-img-top"
                        alt={work.name}
                        width={224}
                        height={168}
                    />

                    <div className="operators-box" style={{ display: isShowOperators ? 'flex' : 'none' }}>
                        <Button variant="" size="sm" onClick={() => window.open(editLink, '_blank')}>
                            编辑
                        </Button>
                    </div>

                    <Card.Body>
                        <Card.Title>
                            <a href={link} className="text-decoration-none stretched-link" target="_blank">
                                {work.name}
                            </a>
                        </Card.Title>
                        <Card.Text className="d-flex justify-content-between align-items-center">
                            <span style={{ fontSize: '14px' }}>{work.username}</span>
                            <span style={{ fontSize: '12px' }}>
                                👀{work.views} 👍{work.likes} 👎{work.unlikes} 💬{work.comments}
                            </span>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <div className="work-status">{publishedText[work.published]}</div>
            </div>
        </OverlayTrigger>
    );
};

const UserPage = () => {
    const [type, setType] = React.useState('normal');
    const [lang, setLang] = React.useState('projects');
    const [status, setStatus] = React.useState('all');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageComponent, setPageComponent] = React.useState(<h2>Loading...</h2>);

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(
                `/api/${lang}/my?type=${type}&published=${status}&page=${currentPage}&per_page=20`,
            );
            const responseData: UserWorkList = await response.json();

            if (responseData.data.total === 0) {
                setPageComponent(<h2>暂时没有作品，快去创作吧</h2>);
                return;
            }
            setPageComponent(
                <>
                    <WorkList works={responseData.data.data} WorkCardInterface={FixedWorkCard} />
                    {responseData.data.total > 20 && (
                        <Pagination
                            pageCount={Math.ceil(responseData.data.total / 20)}
                            value={currentPage}
                            handlePageChange={value => setCurrentPage(value)}
                            className="mt-2"
                        />
                    )}
                </>,
            );
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [type, lang, status, currentPage]);

    return (
        <>
            <NavbarComponent />
            <Container className="mt-5">
                <Card body className="shadow-sm mb-3">
                    <Nav
                        className="mb-2"
                        variant="pills"
                        defaultActiveKey="normal"
                        onSelect={eventKey => setType(eventKey)}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="normal">个人创作</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <OverlayTrigger overlay={<Tooltip>（隋唐练习）</Tooltip>}>
                                <Nav.Link eventKey="homework">随堂练习</Nav.Link>
                            </OverlayTrigger>
                        </Nav.Item>
                    </Nav>

                    <div className="mb-2 d-flex align-items-center">
                        <span>类型</span>
                        <Nav
                            className="custom-nav"
                            defaultActiveKey="projects"
                            onSelect={eventKey => setLang(eventKey)}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="projects">TurboWarp</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="python">Python</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="compilers">C++</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>

                    <div className="d-flex align-items-center">
                        <span>状态</span>
                        <Nav className="custom-nav" defaultActiveKey="all" onSelect={eventKey => setStatus(eventKey)}>
                            <Nav.Item>
                                <Nav.Link eventKey="all">全部</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="0">未发布</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="2">审核中</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="1">已发布</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="removed">已下架</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                </Card>
                {pageComponent}
            </Container>
        </>
    );
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(
        <React.StrictMode>
            <UserPage />
        </React.StrictMode>,
    );
} else {
    throw new Error('Cannot find dom element #app');
}
