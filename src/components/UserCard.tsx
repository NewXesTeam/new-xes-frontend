import * as React from 'react';
import { SimpleUserInfo } from '@/interfaces/user';
import { Button, Card, OverlayTrigger, Stack, Tooltip } from 'react-bootstrap';
import Avatar from './Avatar';

const HorizontalUserCard = ({ user, className = '' }: { user: SimpleUserInfo; className?: string }) => {
    const [userFollowed, setUserFollowed] = React.useState(user.is_follow);
    const userLink = `/space.html?id=${user.id}`;

    const onClickFollow = async () => {
        await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: user.user_id, state: !userFollowed }),
        });
        setUserFollowed(!userFollowed);
    };

    return (
        <Card style={{ padding: '10px' }} className={className}>
            <Card.Body>
                <Stack direction="horizontal">
                    <a href={userLink} target="_blank">
                        <Avatar name={user.realname} avatarUrl={user.avatar_path} size={108} />
                    </a>
                    <div style={{ margin: '26px 20px' }}>
                        <div>
                            <a href={userLink} target="_blank" style={{ marginRight: '31px', fontSize: '18px' }}>
                                {user.realname}
                            </a>
                            <span style={{ marginRight: '40px' }}>关注：{user.follows}</span>
                            <span>粉丝：{user.fans}</span>
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '10px' }}>{user.signature}</div>
                    </div>
                    <Button
                        variant={(userFollowed ? 'outline-' : '') + 'secondary'}
                        onClick={() => onClickFollow()}
                        className="ms-auto"
                    >
                        {userFollowed ? '已关注' : '关注'}
                    </Button>
                </Stack>
            </Card.Body>
        </Card>
    );
};

const SmallUserCard = ({ user }: { user: SimpleUserInfo }) => {
    const userLink = `/space.html?id=${user.id}`;

    return (
        <OverlayTrigger
            overlay={
                <Tooltip>
                    <span style={{ marginRight: '10px' }}>关注：{user.follows}</span>
                    <span>粉丝：{user.fans}</span>
                </Tooltip>
            }
        >
            <Card style={{ padding: '10px' }}>
                <img
                    src={user.avatar_path}
                    alt={user.realname}
                    height={80}
                    width={80}
                    style={{ borderRadius: '50%' }}
                />
                <a className="stretched-link" href={userLink} target="_blank">
                    {user.realname}
                </a>
            </Card>
        </OverlayTrigger>
    );
};

export { HorizontalUserCard, SmallUserCard };
