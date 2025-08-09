import * as React from 'react';
import type { Work } from '@/interfaces/work';
import { Grid } from '@mui/material';
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
                <Grid key={work.topic_id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4, xl: 2.4 }}>
                    <RemovedWorkCard />
                </Grid>
            );
        } else {
            return (
                <Grid key={work.topic_id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4, xl: 2.4 }}>
                    <WorkCardInterface work={work} />
                </Grid>
            );
        }
    });

    return (
        <Grid container spacing={2} className={className}>
            {cards}
        </Grid>
    );
};

export default WorkList;
