import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import AutoCloseAlert from './AutoCloseAlert';
import { v4 as generateUUID } from 'uuid';

import type { ErrorResponse } from '@/interfaces/common';

const CommentBox = ({
    topic_id,
    comment_id,
    isShow,
    setIsShow,
}: {
    topic_id: string;
    comment_id: number;
    isShow: boolean;
    setIsShow: (value: boolean) => void;
}) => {
    const [comment, setComment] = React.useState('');
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);

    const onCLickComment = async () => {
        const response = await fetch('/api/comments/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appid: 1001108,
                comment_from: 'message',
                content: comment,
                target_id: comment_id,
                topic_id: topic_id,
            }),
        });
        if (response.ok) {
            setAlerts([
                <AutoCloseAlert variant="success" key={generateUUID().slice(0, 8)}>
                    回复成功
                </AutoCloseAlert>,
                ...alerts,
            ]);
        } else {
            const responseData: ErrorResponse = await response.json();
            setAlerts([
                <AutoCloseAlert variant="danger" key={generateUUID().slice(0, 8)}>
                    {responseData.message}
                </AutoCloseAlert>,
                ...alerts,
            ]);
        }
        setIsShow(false);
        setComment('');
    };

    return (
        <div style={{ display: isShow ? 'block' : 'none' }}>
            <div className="alert-list">{alerts}</div>
            <Form.Control as="textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} />
            <Button variant="primary" onClick={onCLickComment}>
                Submit
            </Button>
        </div>
    );
};

export default CommentBox;
