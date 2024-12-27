import React from 'react';
import { Row } from 'react-bootstrap';
import WorkCard from './WorkCard.tsx';

const FollowsWorkList = () => {
    const [cards, setCards] = React.useState<Array<React.JSX.Element>>([]);

    React.useEffect(() => {
        let ignore = false;

        const fetchWorkData = async () => {
            const response = await fetch('/api/index/works/follows');
            let data = await response.json();

            let workCards: Array<React.JSX.Element> = [];
            for (let work of data.data) {
                if (work === null) {
                    continue;
                }
                workCards.push(<WorkCard key={work.id} work={work} />);
            }
            setCards(workCards);
        };

        if (!ignore) fetchWorkData();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <Row xs={1} sm={2} md={3} lg={4} xl={5} xxl={6} className="m-4">
            {cards ?? 'Loading...'}
        </Row>
    );
};

export default FollowsWorkList;
