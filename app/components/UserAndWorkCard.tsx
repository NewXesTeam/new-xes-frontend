import * as React from 'react';
import { Button, Card, Stack } from 'react-bootstrap';
import WorkList from '@/components/WorkList';
import Avatar from './Avatar';

const UserAndWorkCard = ({ info, className = '' }: { info: any; className?: string }) => {
    const [userFollowed, setUserFollowed] = React.useState(info.user.is_follow);
    const userLink = `/space/${info.user.id}/home`;

    const onClickFollow = async () => {
        await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: info.user.user_id, state: !userFollowed }),
        });
        setUserFollowed(!userFollowed);
    };

    return (
        <Card style={{ padding: '10px' }} className={className}>
            <Card.Body>
                <Stack direction="horizontal">
                    <a href={userLink} target="_blank">
                        <Avatar
                            name={info.user.realname.replace(/<em>|<\/em>/g, '')}
                            avatarUrl={info.user.avatar_path}
                            size={108}
                        />
                    </a>
                    <div style={{ margin: '26px 20px' }}>
                        <div>
                            <a href={userLink} target="_blank" style={{ marginRight: '31px', fontSize: '18px' }}>
                                {info.user.realname.replace(/<em>|<\/em>/g, '')}
                            </a>
                            <span style={{ marginRight: '40px' }}>关注：{info.user.follows}</span>
                            <span>粉丝：{info.user.fans}</span>
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '10px' }}>{info.user.signature}</div>
                    </div>
                    <Button
                        variant={(userFollowed ? 'outline-' : '') + 'secondary'}
                        onClick={() => onClickFollow()}
                        className="ms-auto"
                    >
                        {userFollowed ? '已关注' : '关注'}
                    </Button>
                </Stack>
                <WorkList works={info.works} />
            </Card.Body>
        </Card>
    );
};

export { UserAndWorkCard };
