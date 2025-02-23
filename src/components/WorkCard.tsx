import * as React from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getWorkLink } from '@/utils';
import { Work } from '@/interfaces/work';

const WorkCard = ({ work }: { work: Work }) => {
    let link = getWorkLink(work);
    let author_url = `/space.html?id=${work.user_id}`;

    return (
        <OverlayTrigger overlay={<Tooltip>{work.published_at}</Tooltip>}>
            <Card className="mb-3">
                <img
                    src={
                        work.thumbnail ||
                        'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                    }
                    className="card-img-top"
                    alt={work.name}
                    width={224}
                    height={168}
                />

                <Card.Body>
                    <Card.Title>
                        <a href={link} className="text-decoration-none stretched-link" target="_blank">
                            {work.name}
                        </a>
                    </Card.Title>
                    <Card.Text className="d-flex justify-content-between align-items-center">
                        <a href={author_url} target="_blank" style={{ maxWidth: '114px', zIndex: 2 }}>
                            <span style={{ fontSize: '14px' }}>{work.username}</span>
                        </a>
                        <span style={{ fontSize: '12px' }}>
                            👀{work.views} 👍{work.likes} 👎{work.unlikes} 💬{work.comments}
                        </span>
                    </Card.Text>
                </Card.Body>
            </Card>
        </OverlayTrigger>
    );
};

const RemovedWorkCard = () => {
    return (
        <Card className="mb-3" body>
            作品已被下架
        </Card>
    );
};

const SmallWorkCard = ({ work }: { work: Work }) => {
    return (
        <OverlayTrigger
            overlay={
                <Tooltip>
                    👀{work.views} 👍{work.likes} 👎{work.unlikes}
                    <br />
                    {work.created_at}
                </Tooltip>
            }
        >
            <Card>
                <Card.Header>
                    <a href={getWorkLink(work)} className="stretched-link">
                        {work.name}
                    </a>
                </Card.Header>
                <Card.Body className="py-0">
                    <img src={work.thumbnail} height={138} className="m-auto" alt={work.name} />
                </Card.Body>
            </Card>
        </OverlayTrigger>
    );
};

export default WorkCard;
export { RemovedWorkCard, SmallWorkCard };
