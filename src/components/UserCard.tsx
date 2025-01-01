import React from 'react';
import { Card } from 'react-bootstrap';
import { SimpleUserInfo } from '../interfaces/user.ts';

const SmallUserCard = ({ user }: { user: SimpleUserInfo }) => {
    return (
        <Card style={{ padding: '10px', margin: 'auto' }}>
            <img src={user.avatar_path} alt={user.realname} style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
            <small>{user.realname}</small>
        </Card>
    );
};

export { SmallUserCard };
