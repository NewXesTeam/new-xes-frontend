import * as React from 'react';
import { Container, Nav, Card, OverlayTrigger, Tooltip, Button, Badge } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';
import WorkList from '@/components/WorkList';
import ProjectPublishModal from '@/components/ProjectPublishModal';
import { Pagination } from '@/components/Pagination';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import { getWorkLink, getEditWorkLink } from '@/utils';
import { v4 as uuidV4 } from 'uuid';

import type { UserWorkList } from '@/interfaces/user';
import type { Work, PublishWorkInfo } from '@/interfaces/work';
import '@/styles/user.scss';

const FixedWorkCard = (
    onClickPublish: (work: PublishWorkInfo) => void,
    onClickCancelPublish: (work: PublishWorkInfo) => void,
) => {
    return ({ work }: { work: Work }) => {
        const publishedText = { 0: '未发布', 1: '已发布', 2: '审核中', removed: '已下架' };
        const [isShowOperators, setIsShowOperators] = React.useState(false);
        let link = getWorkLink(work);
        let editLink = getEditWorkLink(work);
        let workStatus;

        if (work.removed) {
            workStatus = publishedText['removed'];
        } else {
            workStatus = publishedText[work.published];
        }

        return (
            <OverlayTrigger
                overlay={<Tooltip>{work.created_at}</Tooltip>}
                onToggle={value => setIsShowOperators(value)}
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
                            {work.published === 0 && !work.removed && (
                                <Button
                                    variant=""
                                    size="sm"
                                    onClick={() => {
                                        let workData = work as unknown as PublishWorkInfo;
                                        workData.created_source = 'original';
                                        onClickPublish(workData);
                                    }}
                                >
                                    发布
                                </Button>
                            )}
                            {work.published === 1 && (
                                <Button
                                    variant=""
                                    size="sm"
                                    onClick={() => {
                                        let workData = work as unknown as PublishWorkInfo;
                                        onClickCancelPublish(workData);
                                    }}
                                >
                                    取消发布
                                </Button>
                            )}
                        </div>

                        <Card.Body>
                            <Card.Title>
                                <a href={link} className="text-decoration-none stretched-link" target="_blank">
                                    {work.name}
                                </a>
                            </Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                                <span style={{ fontSize: '14px' }}>{work.username}</span>
                                <div>
                                    <Badge pill bg="info" aria-label="浏览量">
                                        👀{work.views}
                                    </Badge>
                                    <Badge pill bg="primary" aria-label="点赞数">
                                        👍{work.likes}
                                    </Badge>
                                    <br />
                                    <Badge pill bg="danger" aria-label="点踩数">
                                        👎{work.unlikes}
                                    </Badge>
                                    <Badge pill bg="success" aria-label="评论数">
                                        💬{work.comments}
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className="work-status">{workStatus}</div>
                </div>
            </OverlayTrigger>
        );
    };
};

export default function UserPage() {
    const [type, setType] = React.useState('normal');
    const [lang, setLang] = React.useState('projects');
    const [status, setStatus] = React.useState('all');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageComponent, setPageComponent] = React.useState(<h2>Loading...</h2>);
    const [showPublishModal, setShowPublishModal] = React.useState(false);
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const publishWork = React.useRef<PublishWorkInfo>(null);

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
                    <WorkList
                        works={responseData.data.data}
                        enableRemoved={false}
                        WorkCardInterface={FixedWorkCard(
                            (work: PublishWorkInfo) => {
                                publishWork.current = work;
                                setShowPublishModal(true);
                            },
                            async (work: PublishWorkInfo) => {
                                await fetch(`/api/${lang}/${work.id}/cancel_publish`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        params: {
                                            id: work.id,
                                        },
                                    }),
                                });
                                setAlerts([
                                    <AutoCloseAlert key={uuidV4()} severity="success">
                                        已取消发布
                                    </AutoCloseAlert>,
                                    ...alerts,
                                ]);
                                setLang(work.lang);
                            },
                        )}
                    />
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
            <div className="alert-list">{alerts}</div>
            <NavbarComponent />
            {showPublishModal && (
                <ProjectPublishModal
                    workInfo={publishWork.current as PublishWorkInfo}
                    isShow={showPublishModal}
                    setIsShow={setShowPublishModal}
                />
            )}
            <Container className="mt-5">
                <Card body className="shadow-sm mb-3">
                    <Nav
                        className="mb-2"
                        variant="pills"
                        defaultActiveKey="normal"
                        onSelect={eventKey => setType(eventKey || 'normal')}
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
                            onSelect={eventKey => setLang(eventKey || 'projects')}
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
                        <Nav
                            className="custom-nav"
                            defaultActiveKey="all"
                            onSelect={eventKey => setStatus(eventKey || 'all')}
                        >
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
}
