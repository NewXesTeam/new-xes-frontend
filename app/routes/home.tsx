import * as React from 'react';
import NavbarComponent from '@/components/Navbar';
import WorkList from '@/components/WorkList';
import { Typography } from '@mui/material';

import type { Work } from '@/interfaces/work';

export default function IndexPage() {
    const [works, setWorks] = React.useState<Array<Work>>([]);

    React.useEffect(() => {
        let ignore = false;

        const fetchWorkData = async () => {
            const response = await fetch('/api/index/works/follows');
            let data = await response.json();
            let workData: Array<Work> = data.data.filter(Boolean);
            setWorks(workData);
        };

        if (!ignore) fetchWorkData();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            <NavbarComponent />
            <div className="mt-5 mb-5">
                <Typography variant="h4" component="h1" className="text-center">
                    我的关注
                </Typography>
                <WorkList works={works} className="m-4" />
            </div>
        </>
    );
}
