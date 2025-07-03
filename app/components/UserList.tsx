import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Stack } from '@mui/material';
import { HorizontalUserCard, SmallUserCard } from './UserCard';

import type { SimpleUserInfo } from '@/interfaces/user';

const UserVerticalList = ({ users }: { users: SimpleUserInfo[] }) => {
    const cards = users.map((user, index) => (
        <HorizontalUserCard key={user.id} className={index >= 1 ? 'mt-2' : ''} user={user} children={null} />
    ));

    return (
        <Stack direction="column" spacing={2}>
            {cards}
        </Stack>
    );
};

const UserHorizontalList = ({ users }: { users: SimpleUserInfo[] }) => {
    const cards = users.map(user => (
        <Col key={user.id}>
            <SmallUserCard user={user} />
        </Col>
    ));

    return <Row xs="auto">{cards}</Row>;
};

export { UserVerticalList, UserHorizontalList };
