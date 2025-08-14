import * as React from 'react';
import {
    Badge,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    CardActions,
    Typography,
    Tooltip,
    Button,
} from '@mui/material';
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
        <Card>
            <Tooltip placement="top" title={work.created_at}>
                <CardActionArea onClick={() => window.open(link, '_blank')}>
                    <CardMedia
                        component="img"
                        alt={work.name.replace(/<em>|<\/em>/g, '')}
                        style={{ cursor: 'pointer', width: 224, height: 168 }}
                        src={
                            work.thumbnail ||
                            'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                        }
                    />

                    <Tooltip placement="bottom" title={work.name.replace(/<em>|<\/em>/g, '')}>
                        <CardContent>
                            <div className="text-neutral-600 truncate" style={{ fontSize: 20 }}>
                                {work.name.replace(/<em>|<\/em>/g, '')}
                            </div>
                        </CardContent>
                    </Tooltip>
                </CardActionArea>
            </Tooltip>

            <CardActions className="flex justify-between">
                <Button className="text-neutral-500" onClick={() => window.open(author_url, '_blank')}>
                    {work.username}
                </Button>

                <div className="flex gap-2" style={{ zoom: 0.75 }}>
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
            </CardActions>
        </Card>
    );
};

const RemovedWorkCard = () => {
    return (
        <Card className="mb-3">
            <CardContent>
                <Typography component="div" sx={{ fontSize: 16 }}>
                    作品已被下架
                </Typography>
            </CardContent>
        </Card>
    );
};

const SmallWorkCard = ({ work }: { work: Work }) => {
    return (
        <Tooltip placement="top" title={`👀${work.views} 👍${work.likes} 👎${work.unlikes} ${work.created_at}`}>
            <Card>
                <CardActionArea onClick={() => window.open(getWorkLink(work), '_blank')}>
                    <CardMedia>
                        <img className="mx-auto" src={work.thumbnail} alt={work.name} style={{ maxHeight: 138 }} />
                    </CardMedia>
                    <CardContent>
                        <div className="text-neutral-600 truncate" style={{ fontSize: 16 }}>
                            {work.name.replace(/<em>|<\/em>/g, '')}
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Tooltip>
    );
};

export default WorkCard;
export { RemovedWorkCard, SmallWorkCard };
