import * as React from 'react';
import { Badge, Card, CardMedia, CardContent, Typography, Tooltip, CardHeader } from '@mui/material';
import { getWorkLink } from '@/utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import type { Work } from '@/interfaces/work';

const WorkCard = ({ work }: { work: Work }) => {
    let link = getWorkLink(work);
    let author_url = `/space/${work.user_id}/home`;

    if (!work.name) {
        return null;
    }

    return (
        <Tooltip placement="top" title={work.created_at}>
            <Card className="mb-3 position-relative">
                <CardMedia
                    component="img"
                    alt={work.name.replace(/<em>|<\/em>/g, '')}
                    width={224}
                    height={168}
                    onClick={() => window.open(link, '_blank')}
                    style={{ cursor: 'pointer' }}
                    src={
                        work.thumbnail ||
                        'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                    }
                />

                <CardContent>
                    <Tooltip placement="top" title={work.name.replace(/<em>|<\/em>/g, '')}>
                        <Typography
                            className="text-truncate text-blue fs-5"
                            color="blue"
                            gutterBottom
                            variant="h5"
                            component="div"
                        >
                            <a href={link} className="text-decoration-none" target="_blank">
                                {work.name.replace(/<em>|<\/em>/g, '')}
                            </a>
                        </Typography>
                    </Tooltip>

                    <div className="d-flex justify-content-between align-items-center">
                        <a href={author_url} target="_blank" className="text-truncate text-blue fs-7 z-index-2">
                            <span>{work.username}</span>
                        </a>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Badge badgeContent={work.views} color="info" aria-label="浏览量" showZero>
                                <VisibilityIcon />
                            </Badge>
                            <Badge badgeContent={work.likes} color="primary" aria-label="点赞数" showZero>
                                <FavoriteIcon />
                            </Badge>
                            <Badge badgeContent={work.unlikes} color="error" aria-label="点踩数" showZero>
                                <ThumbDownIcon />
                            </Badge>
                            <Badge badgeContent={work.comments} color="success" aria-label="评论数" showZero>
                                <CommentIcon />
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Tooltip>
    );
};

const RemovedWorkCard = () => {
    return (
        <Card className="mb-3">
            <CardContent>
                <Typography variant="h5" component="div">
                    作品已被下架
                </Typography>
            </CardContent>
        </Card>
    );
};

const SmallWorkCard = ({ work }: { work: Work }) => {
    return (
        <Tooltip
            placement="top"
            title={`
            👀${work.views} 👍${work.likes} 👎${work.unlikes}
            ${work.created_at}
        `}
        >
            <Tooltip placement="bottom" title={work.name}>
                <Card className="mb-3 position-relative">
                    <Typography className="text-truncate text-blue fs-5">
                        <a href={getWorkLink(work)} className="stretched-link text-decoration-none">
                            {work.name}
                        </a>
                    </Typography>
                    <CardMedia>
                        <img src={work.thumbnail} height={138} className="m-auto" alt={work.name} />
                    </CardMedia>
                </Card>
            </Tooltip>
        </Tooltip>
    );
};

export default WorkCard;
export { RemovedWorkCard, SmallWorkCard };
