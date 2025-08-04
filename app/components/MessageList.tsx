import * as React from 'react';
import { Stack } from '@mui/material';
import { CommentCard, FollowCard } from '@/components/MessageCard';

import type { CommentMessageInfo, FollowMessageInfo } from '@/interfaces/message';

const CommentList = ({ messages, onRead = () => {} }: { messages: CommentMessageInfo; onRead?: () => void }) => {
    const cards = messages.data.data.map((message, index) => (
        <CommentCard className={index >= 1 ? 'mt-2' : ''} message={message} onRead={onRead} />
    ));

    return <Stack>{cards}</Stack>;
};
const FollowList = ({ messages, onRead = () => {} }: { messages: FollowMessageInfo; onRead?: () => void }) => {
    const cards = messages.data.data.map((message, index) => (
        <FollowCard className={index >= 1 ? 'mt-2' : ''} message={message} onRead={onRead} />
    ));

    return <Stack>{cards}</Stack>;
};

export { CommentList, FollowList };
