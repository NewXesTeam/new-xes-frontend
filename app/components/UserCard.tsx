import * as React from 'react';
import {
    Avatar,
    Tooltip,
    Card,
    CardContent,
    Stack,
    Button,
    Typography,
    CardActionArea,
    CardMedia,
    CardActions,
    Divider,
} from '@mui/material';

import type { SimpleUserInfo } from '@/interfaces/user';

const HorizontalUserCard = ({
    user,
    className = '',
    children = undefined,
}: {
    user: SimpleUserInfo;
    className?: string;
    children?: React.ReactNode;
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
        <Card className={className}>
            <div className="flex">
                <CardActionArea
                    className="flex-1"
                    style={{ padding: '10px' }}
                    onClick={() => window.open(userLink, '_blank')}
                >
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 flex-1">
                                <Avatar alt={user.realname} src={user.avatar_path} sx={{ width: 108, height: 108 }} />
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-4 items-center">
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
                                        <div className="flex gap-4" style={{ fontSize: 14 }}>
                                            <span>关注：{user.follows}</span>
                                            <span>粉丝：{user.fans}</span>
                                            <span>UID：{user.id}</span>
                                        </div>
                                    </div>
                                    <Typography variant="body2">{user.signature}</Typography>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </CardActionArea>
                <div className="flex flex-col h-fit my-auto p-2">
                    <Button
                        variant={userFollowed ? 'outlined' : 'contained'}
                        color={userFollowed ? 'secondary' : 'primary'}
                        onClick={() => onClickFollow()}
                    >
                        {userFollowed ? '已关注' : '关注'}
                    </Button>
                </div>
            </div>
            {children ? (
                <>
                    <Divider />
                    <CardActions>{children}</CardActions>
                </>
            ) : null}
        </Card>
    );
};

const SmallUserCard = ({ user }: { user: SimpleUserInfo }) => {
    const userLink = `/space/${user.id}/home`;

    return (
        <Tooltip title={`粉丝：${user.fans} 关注：${user.follows}`}>
            <Card>
                <CardActionArea sx={{ padding: 1 }} onClick={() => window.open(userLink, '_blank')}>
                    <CardMedia
                        className="mx-auto"
                        style={{ height: 80, width: 80, borderRadius: '50%' }}
                        image={user.avatar_path}
                        title={user.realname}
                    />
                    <CardContent sx={{ padding: 1 }}>
                        <span className="overflow-hidden text-ellipsis" style={{ fontSize: 20 }}>
                            {user.realname}
                        </span>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Tooltip>
    );
};

export { HorizontalUserCard, SmallUserCard };
