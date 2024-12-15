import React from 'react';
import { Row } from 'react-bootstrap';
import WorkCard from './WorkCard.tsx';

interface FollowsWorkListState {
    cards: Array<React.JSX.Element>;
}

class FollowsWorkList extends React.Component {
    state: FollowsWorkListState;

    constructor(props) {
        super(props);
        this.state = {
            cards: [],
        };
    }

    async componentDidMount() {
        const response = await fetch('/api/index/works/follows');
        let data = await response.json();

        let cards: Array<React.JSX.Element> = [];
        for (let work of data.data) {
            if (work === null) {
                continue;
            }
            cards.push(<WorkCard key={work.id} work={work} />);
        }
        this.setState({ cards: cards });
    }

    render() {
        return (
            <Row xs={1} sm={2} md={3} lg={4} xl={5} xxl={6} className="m-4">
                {this.state.cards}
            </Row>
        );
    }
}

export default FollowsWorkList;
