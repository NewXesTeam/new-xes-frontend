import * as React from 'react';
import { DataItem, DataItem2 } from '@/interfaces/message';
import { Button, Card, Stack } from 'react-bootstrap';
import AutoCloseAlert from './AutoCloseAlert';
import { parse } from 'uuid';
import Avatar from './Avatar';

const CommentCard = ({ message, className = '' }: { message: DataItem; className?: string }) => {
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const [isShow, setIsShow] = React.useState<boolean>(true);
    const senduserLink = `/space.html?id=${message.send_user_id}`;
    const message_topic_text = React.useRef(null);
    const message_content_sub = React.useRef(null);
    const message_content_main = React.useRef(null);

    React.useEffect(()=>{
        if (message_topic_text.current){
            message_topic_text.current.innerHTML = message.topic.text;
        }
        if (message_content_sub.current){
            message_content_sub.current.innerHTML = message.content.sub.content;
        }
        if (message_content_main.current){
            message_content_main.current.innerHTML = message.content.main.content;
        }
    },[])
    return (
        <>
            <div className="alert-list">{alerts}</div>
            <Card style={{ padding: '10px', display: isShow ? 'block' : 'none' }} className={className}>
                <Card.Body>
                    <Stack direction="horizontal">
                        <a href={senduserLink} target="_blank">
                            <Avatar name={message.send_username} avatarUrl={message.send_user_avatar_path} size={108} />
                        </a>
                        <div style={{ margin: '26px 20px' }}>
                            <div style={{ display: 'block', paddingBottom: '5px' }}>
                                <a href={senduserLink} target="_blank" style={{ fontSize: '18px' }}>
                                    {message.send_username}
                                </a>
                                {message.content.sub == null && (
                                    <p style={{ color: 'grey', fontSize: 'small', display: 'inline' }}>
                                        {' '}
                                        评论了你的作品：
                                        <a
                                            style={{ color: 'black', textDecoration: 'none', fontSize: '15px' }}
                                            href={message.topic.link}
                                            target="_blank"
                                        >
                                            <span ref={message_topic_text}></span>
                                        </a>
                                    </p>
                                )}
                                {message.content.sub != null && (
                                    <p style={{ color: 'grey', fontSize: 'small', display: 'inline' }}>
                                        {' '}
                                        回复了你的评论：
                                        <a
                                            style={{ color: 'black', textDecoration: 'none', fontSize: '15px' }}
                                            href={message.topic.link}
                                            target="_blank"
                                            ref={message_content_sub}
                                        ></a>
                                    </p>
                                )}
                            </div>
                            <a
                                href={message.topic.link}
                                style={{
                                    display: 'block',
                                    color: 'black',
                                    textDecoration: 'none',
                                    paddingBottom: '5px',
                                }}
                                dangerouslySetInnerHTML={{__html:message.content.main.content}}
                            ></a>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={async () => {
                                    await fetch('/api/messages/delete', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ category: message.category, id: message.id }),
                                    });
                                    setAlerts([<AutoCloseAlert variant="success">删除成功</AutoCloseAlert>, ...alerts]);
                                    setIsShow(false);
                                }}
                            >
                                删除
                            </Button>
                        </div>
                        <a className="ms-auto" href={message.topic.link}>
                            <img src={message.topic.thumbnail} width={224} height={168} />
                        </a>
                    </Stack>
                </Card.Body>
            </Card>
        </>
    );
};
const FollowCard = ({ message, className = '' }: { message: DataItem2; className?: string }) => {
    const [userFollowed, setUserFollowed] = React.useState(message.follow_status === 1);
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const userLink = `/space.html?id=${message.send_user_id}`;

    const onClickFollow = async () => {
        await fetch('/api/space/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followed_user_id: message.send_user_id, state: !userFollowed }),
        });
        setUserFollowed(!userFollowed);
        setAlerts([<AutoCloseAlert variant="success">删除成功</AutoCloseAlert>, ...alerts]);
    };

    return (
        <>
            <div className="alert-list">{alerts}</div>
            <Card style={{ padding: '10px' }} className={className}>
                <Card.Body>
                    <Stack direction="horizontal">
                        <a href={userLink} target="_blank">
                            <Avatar name={message.send_username} avatarUrl={message.send_user_avatar_path} size={108} />
                        </a>
                        <div style={{ margin: '26px 20px' }}>
                            <a href={userLink} target="_blank" style={{ marginRight: '31px', fontSize: '18px' }}>
                                {message.send_username}
                            </a>
                            <div style={{ fontSize: '14px', marginTop: '10px' }}>{message.signature}</div>
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
        </>
    );
};

export { CommentCard, FollowCard };
