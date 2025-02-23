import * as React from 'react';
import { UserAndWorkCard } from './UserAndWorkCard';
import { Stack } from 'react-bootstrap';

const UserAndWorkList = ({ infos }: { infos: any[] }) => {
    const cards = infos.map((info, index) => (
        <UserAndWorkCard key={info.id} className={index >= 1 ? 'mt-2' : ''} info={info} />
    ));

    return <Stack>{cards}</Stack>;
};

export { UserAndWorkList };
