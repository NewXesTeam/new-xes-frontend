import * as React from 'react';
import { Pagination } from '@mui/material';

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
    const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
        if (page < 1) page = 1;
        if (page > pageCount) page = pageCount;
        setCurrentPage(page);
        handlePageChange(page);
    };

    return (
        <Pagination
            className={className}
            color="primary"
            variant="outlined"
            count={pageCount}
            page={currentPage}
            onChange={handleChange}
        ></Pagination>
    );
};

export { MyPagination as Pagination };
