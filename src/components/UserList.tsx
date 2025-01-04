import React from 'react';
import { SmallUserCard } from './UserCard.tsx';
import { SimpleUserInfo } from '../interfaces/user.ts';
import { Row, Col } from 'react-bootstrap';

const UserHorizontalList = ({ users }: { users: SimpleUserInfo[] }) => {
    const cards = users.map(user => (
        <Col key={user.id}>
            <SmallUserCard user={user} />
        </Col>
    ));

    return <Row xs="auto">{cards}</Row>;
};

export { UserHorizontalList };
