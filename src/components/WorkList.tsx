import React from 'react';
import { Row } from 'react-bootstrap';
import { Work } from '../interfaces/work.ts';
import WorkCard from './WorkCard.tsx';

const WorkList = ({ works }: { works: Array<Work> }) => {
    const cards = works.map((work: Work) => <WorkCard key={work.id} work={work} />);

    return (
        <Row xs={1} sm={2} md={3} lg={4} xl={5} xxl={6} className="m-4">
            {cards}
        </Row>
    );
};

export default WorkList;
