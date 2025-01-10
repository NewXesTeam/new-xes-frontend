import React from 'react';
import { Pagination, Form, InputGroup } from 'react-bootstrap';
import './Pagination.scss';

const MyPagination = ({
    pageCount,
    value = 1,
    handlePageChange,
    className = '',
}: {
    pageCount: number;
    value?: number;
    handlePageChange: (page: number) => void;
    className?: string;
}) => {
    const [currentPage, setCurrentPage] = React.useState(value);
    const setPage = (page: number) => {
        if (page < 1) page = 1;
        if (page > pageCount) page = pageCount;
        setCurrentPage(page);
    };

    return (
        <Pagination className={className}>
            <Pagination.Item
                href="#"
                onClick={() => {
                    setPage(currentPage - 1);
                    handlePageChange(currentPage - 1);
                }}
                disabled={currentPage <= 1}
            >
                上一页
            </Pagination.Item>
            <div className="page-item page-input mb-3">
                <InputGroup>
                    <InputGroup.Text>页码</InputGroup.Text>
                    <Form.Control
                        type="number"
                        min={1}
                        max={pageCount}
                        value={currentPage}
                        placeholder={`1~${pageCount}`}
                        style={{ width: '100px' }}
                        onChange={event => setPage(parseInt(event.currentTarget.value))}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                setPage(parseInt(event.currentTarget.value));
                                handlePageChange(parseInt(event.currentTarget.value));
                                document.documentElement.scrollTop = 0;
                            }
                        }}
                        onBlur={event => {
                            setPage(parseInt(event.currentTarget.value));
                            handlePageChange(parseInt(event.currentTarget.value));
                        }}
                    />
                </InputGroup>
            </div>
            <Pagination.Item
                href="#"
                onClick={() => {
                    setPage(currentPage + 1);
                    handlePageChange(currentPage + 1);
                }}
                disabled={currentPage >= pageCount}
            >
                下一页
            </Pagination.Item>
        </Pagination>
    );
};

export { MyPagination as Pagination };