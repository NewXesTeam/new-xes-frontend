import * as React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { redirect } from 'react-router';
import NavbarComponent from '@/components/Navbar';
import WorkList from '@/components/WorkList';
import { Pagination } from '@/components/Pagination';

import type { Route } from './+types/discover';
import type { WorkList as IWorkList } from '@/interfaces/work';

export async function loader({ request }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
    };
}

export default function DiscoverPage({ loaderData }: Route.ComponentProps) {
    if (!loaderData.isLoggedIn) {
        redirect('/login');
        return null;
    }

    const [currentPage, setCurrentPage] = React.useState(1);
    const [orderLang, setOrderLang] = React.useState<string>('');
    const [orderType, setOrderType] = React.useState<string>('latest');
    const [works, setWorks] = React.useState<React.JSX.Element>(<h2>加载中...</h2>);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/works/${orderType}?lang=${orderLang}&page=${currentPage}&per_page=50`);
            const responseData: IWorkList = await response.json();
            // console.log(responseData);

            if (responseData['total'] === 0) {
                setWorks(<h2>暂无作品</h2>);
            }
            setWorks(
                <>
                    <div className="d-flex justify-content-between">
                        <Nav
                            className="mb-2 left-padding"
                            variant="pills"
                            defaultActiveKey=""
                            onSelect={(eventKey: string | null) => {
                                if (eventKey !== orderLang) {
                                    setOrderLang(eventKey ?? '');
                                    setCurrentPage(1);
                                }
                            }}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="">全部</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="scratch">TurboWarp</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="python">Python</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="cpp">C++</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Nav
                            className="mb-2 right-padding"
                            variant="pills"
                            defaultActiveKey="latest"
                            onSelect={(eventKey: string | null) => {
                                if (eventKey !== orderType) {
                                    setOrderType(eventKey ?? 'latest');
                                    setCurrentPage(1);
                                }
                            }}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="latest">最新发布</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="popular">最受欢迎</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="courses">随堂练习</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>

                    <WorkList works={responseData.data} />
                    {responseData.total > 20 && (
                        <div style={{ width: '100%' }}>
                            <Pagination
                                pageCount={Math.ceil(responseData.total / 20)}
                                value={currentPage}
                                handlePageChange={page => {
                                    setCurrentPage(page);
                                }}
                                className="m-auto width-fit-content"
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
    }, [currentPage, orderLang, orderType]);

    return (
        <>
            <NavbarComponent />
            <Container className="mt-5">{works}</Container>
        </>
    );
}
