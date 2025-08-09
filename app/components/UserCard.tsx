import * as React from 'react';
import { Avatar, Tooltip, Card, CardContent, Stack, Button, Typography } from '@mui/material';

import type { SimpleUserInfo } from '@/interfaces/user';

const HorizontalUserCard = ({
    user,
    className = '',
    children = null,
}: {
    user: SimpleUserInfo;
    className?: string;
    children: React.ReactNode | null;
}) => {
    const [userFollowed, setUserFollowed] = React.useState(user.is_follow || user.is_followed);
    const userLink = `/space/${user.id}/home`;

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
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <a href={userLink} target="_blank" style={{ textDecoration: 'none' }}>
                            <Avatar alt={user.realname} src={user.avatar_path} sx={{ width: 108, height: 108 }} />
                        </a>
                        <div>
                            <Typography
                                variant="h6"
                                component="a"
                                href={userLink}
                                target="_blank"
                                style={{ textDecoration: 'none' }}
                            >
                                {user.user_id === undefined
                                    ? '666这入关注了undefined先生'
                                    : user.realname.replace(/<em>|<\/em>/g, '')}
                            </Typography>
                            <Typography variant="body2">
                                关注：{user.follows} 粉丝：{user.fans}
                            </Typography>
                            <Typography variant="body2" style={{ marginTop: '10px' }}>
                                {user.signature}
                            </Typography>
                        </div>
                    </Stack>
                    <Button
                        variant={userFollowed ? 'outlined' : 'contained'}
                        color={userFollowed ? 'secondary' : 'primary'}
                        onClick={() => onClickFollow()}
                    >
                        {userFollowed ? '已关注' : '关注'}
                    </Button>
                </Stack>
            </CardContent>
            {children}
        </Card>
    );
};

const SmallUserCard = ({ user }: { user: SimpleUserInfo }) => {
    const userLink = `/space/${user.id}/home`;

    return (
        <Tooltip title={`粉丝：${user.fans}   关注：${user.follows}`}>
            <Card style={{ padding: '10px' }} className="position-relative">
                <img
                    src={user.avatar_path}
                    alt={user.realname}
                    height={80}
                    width={80}
                    style={{ borderRadius: '50%' }}
                />
                <br />
                <a href={userLink} target="_blank" className="stretched-link">
                    {user.realname}
                </a>
            </Card>
        </Tooltip>
    );
};

export { HorizontalUserCard, SmallUserCard };
