import React from 'react';
import { SimpleUserInfo } from '../interfaces/user.ts';
import { Card } from 'react-bootstrap';

const SmallUserCard = ({ user }: { user: SimpleUserInfo }) => {
    const userLink = `/space.html?id=${user.id}`;

    return (
        <Card style={{ padding: '10px' }}>
            <img src={user.avatar_path} alt={user.realname} height={80} width={80} style={{ borderRadius: '50%' }} />
            <a className="stretched-link" href={userLink}>
                {user.realname}
            </a>
        </Card>
    );
};

export { SmallUserCard };
