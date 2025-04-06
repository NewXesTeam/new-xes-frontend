import * as React from 'react';
import { Col, Stack } from 'react-bootstrap';
import { CommentCard, FollowCard } from '@/components/MessageCard';

import type { CommentMessageInfo, FollowMessageInfo } from '@/interfaces/message';

const CommentList = ({ messages, onRead = () => {} }: { messages: CommentMessageInfo; onRead?: () => void }) => {
    const cards = messages.data.data.map((message, index) => (
        <Col key={message.id}>
            <CommentCard className={index >= 1 ? 'mt-2' : ''} message={message} onRead={onRead} />
        </Col>
    ));

    return <Stack>{cards}</Stack>;
};
const FollowList = ({ messages, onRead = () => {} }: { messages: FollowMessageInfo; onRead?: () => void }) => {
    const cards = messages.data.data.map((message, index) => (
        <Col key={message.id}>
            <FollowCard className={index >= 1 ? 'mt-2' : ''} message={message} onRead={onRead} />
        </Col>
    ));

    return <Stack>{cards}</Stack>;
};

export { CommentList, FollowList };
