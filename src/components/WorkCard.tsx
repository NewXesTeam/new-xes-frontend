import React from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getWorkLink } from '../utils.ts';
import { Work } from '../interfaces/work.ts';

const WorkCard = ({ work }: { work: Work }) => {
    let link = getWorkLink(work);
    let author_url = `/space.html?id=${work.user_id}`;

    return (
        <Card className="mb-3">
            <a href={link} className="text-decoration-none" target="_blank">
                <OverlayTrigger overlay={<Tooltip>{work.created_at}</Tooltip>}>
                    <img
                        src={work.thumbnail==null ? "https://t.100tal.com/avatar/%E6%97%A0":work.thumbnail}
                        className="card-img-top padding-5px"
                        alt={work.name}
                        width={224}
                        height={168}
                    />
                </OverlayTrigger>

                <Card.Body>
                    <Card.Title>{work.name}</Card.Title>
                    <Card.Text style={{ transform: 'rotate(0)' }}>
                        <a href={author_url} target="_blank">
                            <span style={{ fontSize: '14px' }}>{work.username}</span>
                        </a>
                        <span style={{ fontSize: '12px' }}>
                            👀{work.views} 👍{work.likes} 👎{work.unlikes}
                        </span>
                    </Card.Text>
                </Card.Body>
            </a>
        </Card>
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
                    <img src={work.thumbnail} height={138} className="m-auto" />
                </Card.Body>
            </Card>
        </OverlayTrigger>
    );
};

export default WorkCard;
export { RemovedWorkCard, SmallWorkCard };
