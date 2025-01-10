import React from 'react';
import { createRoot } from 'react-dom/client';
import { Work } from './interfaces/work.ts';
import { Form, Container, Nav, Card } from 'react-bootstrap';
import NavbarComponent from './components/Navbar.tsx';
import  WorkList  from './components/WorkList.tsx';
import { Pagination } from './components/Pagination.tsx';
import { checkLoggedIn } from './utils.ts';
import './styles/common.scss';

const DiscoverPage = () => {
    if (!checkLoggedIn()) {
        location.href = '/login.html';
        return null;
    }
    const [currentPage, setCurrentPage] = React.useState(1);
    const [lang, setLang] = React.useState<string | null>('');
    const [type, setType] = React.useState<string | null>('latest');
    const [works, setWorks] = React.useState<React.JSX.Element | string>('Loading...');

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const response = await fetch(`/api/works/${type}?type=${type}&lang=${lang}&tag=&page=${currentPage}&per_page=50`);
            const responseData: {data:Work[]} = await response.json();
            // console.log(responseData);

            if (responseData['total'] === 0) {
                setWorks(<h2>暂无作品</h2>);
            }
            setWorks(
                <>
                    <div className='d-flex justify-content-between'>
                        <Nav
                            className="mb-2 left-padding"
                            variant="pills"
                            id='langa'
                            defaultActiveKey={""}
                            onSelect={(eventKey: string | null) => setLang(eventKey)}
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
                            id='typea'
                            defaultActiveKey={"latest"}
                            onSelect={(eventKey: string | null) => setType(eventKey)}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="popular">最受欢迎</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="latest">最新发布</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="courses">随堂练习</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    
                    <WorkList works={responseData.data} />
                    {responseData['total'] > 20 && (
                        <div style={{ width: '100%' }}>
                            <Pagination
                                pageCount={Math.ceil(responseData['total'] / 20)}
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
    }, [currentPage, lang, type]);

    return (
        <>
            <NavbarComponent />
            <Container className="mt-5">{works}</Container>
        </>
    );
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(<DiscoverPage />);
} else {
    throw new Error('Cannot find dom element #app');
}
