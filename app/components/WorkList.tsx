import * as React from 'react';
import type { Work } from '@/interfaces/work';
import { Row, Col } from 'react-bootstrap';
import WorkCard from './WorkCard';
import { RemovedWorkCard } from './WorkCard';

const WorkList = ({
    works,
    className = '',
    enableRemoved = true,
    WorkCardInterface = WorkCard,
}: {
    works: Work[];
    className?: string;
    enableRemoved?: boolean;
    WorkCardInterface?: ({ work }: { work: Work }) => React.JSX.Element | null;
}) => {
    const cards = works.map((work: Work) => {
        if (work === null) {
            return null;
        } else if (work.removed && enableRemoved) {
            return (
                <Col key={work.topic_id}>
                    <RemovedWorkCard />
                </Col>
            );
        } else {
            return (
                <Col key={work.topic_id}>
                    <WorkCardInterface work={work} />
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
