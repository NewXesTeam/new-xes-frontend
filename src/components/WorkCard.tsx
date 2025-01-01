import React from 'react';
import { Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getWorkLink } from '../utils.ts';
import { Work } from '../interfaces/work.ts';

const WorkCard = ({ work }: { work: Work }) => {
    let link = getWorkLink(work);
    let author_url = `/space.html?user_id=${work.user_id}`;

    return (
        <Col>
            <Card className="mb-3">
                <a href={link} className="text-decoration-none" target="_blank">
                    <OverlayTrigger overlay={<Tooltip>{work.created_at}</Tooltip>}>
                        <img src={work.thumbnail} className="card-img-top padding-5px" alt={work.name} />
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
        </Col>
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
export { SmallWorkCard };
