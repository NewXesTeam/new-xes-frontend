import * as React from 'react';
import { Work } from '@/interfaces/work';
import { Row, Col } from 'react-bootstrap';
import WorkCard from './WorkCard';
import { RemovedWorkCard } from './WorkCard';

const WorkList = ({ works, className = '' }: { works: Work[]; className?: string }) => {
    const cards = works.map((work: Work) => {
        if (work === null) {
            return null;
        } else if (work.removed) {
            return (
                <Col key={work.topic_id}>
                    <RemovedWorkCard />
                </Col>
            );
        } else {
            return (
                <Col key={work.topic_id}>
                    <WorkCard work={work} />
                </Col>
            );
        }
    });

    return (
        <Row xs={1} sm={2} md={3} lg={4} xl={5} className={className}>
            {cards}
        </Row>
    );
};

export default WorkList;
