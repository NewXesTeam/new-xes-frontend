import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Work } from '../interfaces/work.ts';
import WorkCard from './WorkCard.tsx';

const WorkList = ({ works, className = '' }: { works: Work[]; className?: string }) => {
    const cards = works.map((work: Work) => (
        <Col key={work.id}>
            <WorkCard work={work} />
        </Col>
    ));

    return (
        <Row xs={1} sm={2} md={3} lg={4} xl={5} className={className}>
            {cards}
        </Row>
    );
};

export default WorkList;
