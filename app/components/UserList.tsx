import * as React from 'react';
import { HorizontalUserCard, SmallUserCard } from './UserCard';

import type { SimpleUserInfo } from '@/interfaces/user';

const UserVerticalList = ({ users }: { users: SimpleUserInfo[] }) => {
    const cards = users.map((user, index) => (
        <HorizontalUserCard key={user.id} className={index >= 1 ? 'mt-2' : ''} user={user} />
    ));

    return <div className="flex flex-col gap-2">{cards}</div>;
};

const UserHorizontalList = ({ users }: { users: SimpleUserInfo[] }) => {
    const cards = users.map(user => <SmallUserCard key={user.id} user={user} />);

    return <div className="flex mx-auto w-fit gap-2">{cards}</div>;
};

export { UserVerticalList, UserHorizontalList };
