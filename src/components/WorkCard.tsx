import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { getWorkLink } from '../utils.ts';
import { Work } from '../interfaces/work.ts';

const WorkCard = ({ work }: { work: Work }) => {
    let link = getWorkLink(work);
    let author_url = `/space.html?user_id=${work.user_id}`;

    return (
        <Col>
            <Card className="mb-3">
                <a href={link} className="text-decoration-none" target="_blank">
                    <img src={work.thumbnail} className="card-img-top padding-5px" alt={work.name} />
                    <Card.Body>
                        <Card.Title>{work.name}</Card.Title>
                        <Card.Text style={{ transform: 'rotate(0)' }}>
                            <a href={author_url} target="_blank">
                                {work.username}
                            </a>
                            👀{work.views} 👍{work.likes} 👎{work.unlikes}
                        </Card.Text>
                        <Card.Text>
                            <small className="text-body-secondary">{work.created_at}</small>
                        </Card.Text>
                    </Card.Body>
                </a>
            </Card>
        </Col>
    );
};

export default WorkCard;
