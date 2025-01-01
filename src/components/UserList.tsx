import React from 'react';
import { Stack } from 'react-bootstrap';
import { SmallUserCard } from './UserCard.tsx';
import { SimpleUserInfo } from '../interfaces/user.ts';

const UserHorizontalList = ({ users }: { users: SimpleUserInfo[] }) => {
    const cards = users.map(user => <SmallUserCard key={user.id} user={user} />);

    return <Stack direction="horizontal">{cards}</Stack>;
};

export { UserHorizontalList };
