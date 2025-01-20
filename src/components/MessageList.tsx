import * as React from 'react';
import { CommentCard, FollowCard } from '@/components/MessageCard';
import { CommentMessageInfo, FollowMessageInfo } from '@/interfaces/message';
import { Row, Col, Stack } from 'react-bootstrap';

const CommentList = ({ messages }: { messages: CommentMessageInfo }) => {
    const cards = messages.data.data.map((message, index) => (
        <Col key={message.id}>
            <CommentCard className={index >= 1 ? 'mt-2' : ''} message={message} />
        </Col>
    ));

    return <Stack>{cards}</Stack>;
};
const FollowList = ({ messages }: { messages: FollowMessageInfo }) => {
    const cards = messages.data.data.map((message, index) => (
        <Col key={message.id}>
            <FollowCard className={index >= 1 ? 'mt-2' : ''} message={message} />
        </Col>
    ));

    return <Stack>{cards}</Stack>;
};

export { CommentList, FollowList };
