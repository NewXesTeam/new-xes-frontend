import React from "react";
import { Col, Card } from "react-bootstrap";

const WorkCard = ({ work }) => {
    console.log(work);

    let lang = work.project_type;
    if (lang === "compiler") lang = "code";

    let link = `https://code.xueersi.com/home/project/detail?lang=${lang}&pid=${work.id}&version=${work.version}&langType=${work.lang}`;
    let author_url = `https://code.xueersi.com/space/${work.user_id}`;

    return (
        <Col>
            <Card className="mb-3">
                <a href={link} class="text-decoration-none" target="_blank">
                    <img src={work.thumbnail} className="card-img-top padding-5px" alt={work.name} />
                    <Card.Body>
                        <Card.Title>{work.name}</Card.Title>
                        <Card.Text style={{ transform: "rotate(0)" }}>
                            <a href={author_url} target="_blank">{work.username}</a>
                            👀{work.views} 👍{work.likes} 👎{work.unlikes}
                        </Card.Text>
                        <Card.Text>
                            <small class="text-body-secondary">{work.created_at}</small>
                        </Card.Text>
                    </Card.Body>
                </a>
            </Card>
        </Col>
    );
}

export default WorkCard;
