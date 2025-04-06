import * as React from 'react';
import { Button, Card, Stack } from 'react-bootstrap';
import AutoCloseAlert from './AutoCloseAlert';
import Avatar from './Avatar';
import { processEmojiReplace } from '@/utils';
import { v4 as uuidV4 } from 'uuid';
import DOMPurify from 'dompurify';

import type { CommentDataItem, FollowDataItem } from '@/interfaces/message';

const CommentCard = ({
    message,
    className = '',
    onRead = () => {},
}: {
    message: CommentDataItem;
    className?: string;
    onRead: () => void;
}) => {
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const [isShow, setIsShow] = React.useState<boolean>(true);
    const [needRead, setNeedRead] = React.useState<boolean>(message.read_at == '');
    const sendUserLink = `/space/${message.send_user_id}/home`;

    const onClickRead = async () => {
        await fetch('/api/messages/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: 1, id: message.id }),
        });
        setNeedRead(false);
        setAlerts([
            <AutoCloseAlert variant="success" key={uuidV4()}>
                已阅读
            </AutoCloseAlert>,
            ...alerts,
        ]);
        onRead();
    };

    return (
        <>
            <div className="alert-list">{alerts}</div>
            <Card
                className={className}
                style={{
                    display: isShow ? 'block' : 'none',
                    borderLeftColor: needRead ? 'red' : 'var(--bs-border-color-translucent)',
                    borderLeftWidth: needRead ? '3px' : '1px',
                }}
                onClick={needRead ? onClickRead : () => {}}
            >
                <Card.Body>
                    <Stack direction="horizontal">
                        <a href={sendUserLink} target="_blank" style={{ alignSelf: 'flex-start' }}>
                            <Avatar name={message.send_username} avatarUrl={message.send_user_avatar_path} size={50} />
                        </a>
                        <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                            <div style={{ display: 'block', paddingBottom: '5px' }}>
                                <a href={sendUserLink} target="_blank" style={{ fontSize: '18px' }}>
                                    {message.send_username}
                                </a>
                                {message.content.sub == null && (
                                    <div style={{ display: 'inline' }}>
                                        <span style={{ color: 'grey', fontSize: 'small', marginLeft: '5px' }}>
                                            评论了你的作品：
                                        </span>
                                        <a
                                            href={message.topic.link}
                                            target="_blank"
                                            style={{ textDecoration: 'none', fontSize: '15px' }}
                                        >
                                            {message.topic.text}
                                        </a>
                                    </div>
                                )}
                                {message.content.sub != null && (
                                    <div style={{ display: 'inline' }}>
                                        <span style={{ color: 'grey', fontSize: 'small', marginLeft: '5px' }}>
                                            回复了你的评论：
                                        </span>
                                        <div
                                            style={{
                                                display: 'inline',
                                                color: 'black',
                                                textDecoration: 'none',
                                                fontSize: '15px',
                                            }}
                                            ref={node => {
                                                if (node) {
                                                    node.innerHTML = processEmojiReplace(
                                                        // @ts-ignore  // 这里ide有bug
                                                        DOMPurify.sanitize(message.content.sub.content),
                                                        // @ts-ignore
                                                        message.content.sub.emojis,
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div
                                style={{
                                    display: 'block',
                                    color: 'black',
                                    textDecoration: 'none',
                                    paddingBottom: '5px',
                                }}
                                ref={node => {
                                    if (node) {
                                        node.innerHTML = processEmojiReplace(
                                            DOMPurify.sanitize(message.content.main.content),
                                            message.content.main.emojis,
                                        );
                                    }
                                }}
                            />
                            <div>
                                <span
                                    style={{
                                        color: 'grey',
                                        fontSize: '12px',
                                        marginRight: '10px',
                                    }}
                                >
                                    {message.created_at}
                                </span>
                                <Button
                                    size="sm"
                                    className="nxf-btn-primary"
                                    onClick={async () => {
                                        await fetch('/api/messages/delete', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ category: message.category, id: message.id }),
                                        });
                                        setAlerts([
                                            <AutoCloseAlert variant="success">删除成功</AutoCloseAlert>,
                                            ...alerts,
                                        ]);
                                        setIsShow(false);
                                    }}
                                >
                                    删除
                                </Button>
                            </div>
                        </div>
                        <a className="ms-auto" href={message.topic.link} style={{ alignSelf: 'flex-start' }}>
                            <img
                                src={message.topic.thumbnail}
                                alt={message.topic.text}
                                width={107}
                                height={80}
                                style={{ borderRadius: '6px' }}
                            />
                        </a>
                    </Stack>
                </Card.Body>
            </Card>
        </>
    );
};

const FollowCard = ({
    message,
    className = '',
    onRead,
}: {
    message: FollowDataItem;
    className?: string;
    onRead: () => void;
}) => {
    const [userFollowed, setUserFollowed] = React.useState(message.follow_status === 1);
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const [needRead, setNeedRead] = React.useState<boolean>(message.read_at == '');
    const userLink = `/space/${message.send_user_id}/home`;

    const onClickRead = async () => {
        await fetch('/api/messages/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: 5, id: message.id }),
        });
        setNeedRead(false);
        setAlerts([
            <AutoCloseAlert variant="success" key={uuidV4()}>
                已阅读
            </AutoCloseAlert>,
            ...alerts,
        ]);
        onRead();
    };

    const onClickFollow = async () => {
        await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: message.send_user_id, state: !userFollowed }),
        });
        setUserFollowed(!userFollowed);
        console.log(userFollowed);
        setAlerts([
            <AutoCloseAlert variant="success" key={uuidV4()}>
                {userFollowed ? '取消关注' : '关注'}成功
            </AutoCloseAlert>,
            ...alerts,
        ]);
    };

    return (
        <>
            <div className="alert-list">{alerts}</div>
            <Card
                className={className}
                style={{
                    borderLeftColor: needRead ? 'red' : 'var(--bs-border-color-translucent)',
                    borderLeftWidth: needRead ? '3px' : '1px',
                }}
                onClick={needRead ? onClickRead : () => {}}
            >
                <Card.Body>
                    <Stack direction="horizontal">
                        <div className="notifition-dot" style={{ display: needRead ? 'block' : 'none' }}></div>
                        <a href={userLink} target="_blank">
                            <Avatar name={message.send_username} avatarUrl={message.send_user_avatar_path} size={50} />
                        </a>
                        <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                            <a href={userLink} target="_blank" style={{ marginRight: '31px', fontSize: '18px' }}>
                                {message.send_username}
                            </a>
                            <div style={{ fontSize: '14px' }}>{message.signature}</div>
                            <div>
                                <span
                                    style={{
                                        color: 'grey',
                                        fontSize: '12px',
                                        marginRight: '10px',
                                    }}
                                >
                                    {message.created_at}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant={(userFollowed ? 'outline-' : '') + 'secondary'}
                            onClick={onClickFollow}
                            className="ms-auto"
                        >
                            {userFollowed ? '已关注' : '关注'}
                        </Button>
                    </Stack>
                </Card.Body>
            </Card>
        </>
    );
};

export { CommentCard, FollowCard };
