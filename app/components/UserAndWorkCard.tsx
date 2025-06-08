import * as React from 'react';
import WorkList from '@/components/WorkList';
import { HorizontalUserCard } from './UserCard';

const UserAndWorkCard = ({ info, className = '' }: { info: any; className?: string }) => {
    return (
        <HorizontalUserCard user={info.user} className={className}>
            <WorkList works={info.works} />
        </HorizontalUserCard>
    );
};

export { UserAndWorkCard };
