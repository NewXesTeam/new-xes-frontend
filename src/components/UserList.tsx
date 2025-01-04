import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { SmallUserCard } from './UserCard.tsx';
import { SimpleUserInfo } from '../interfaces/user.ts';

const UserHorizontalList = ({ users }: { users: SimpleUserInfo[] }) => {
    const cards = users.map(user => (
        <Col key={user.id}>
            <SmallUserCard user={user} />
        </Col>
    ));

    return <Row xs="auto">{cards}</Row>;
};

export { UserHorizontalList };
