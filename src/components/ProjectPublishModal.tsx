import * as React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import { PublishWorkInfo } from '@/interfaces/work';
import '@/styles/common.scss';

const ProjectPublishModal = ({
    work,
    isShow,
    setIsShow,
}: {
    work: PublishWorkInfo;
    isShow: boolean;
    setIsShow: (show: boolean) => void;
}) => {
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);

    const onClickPublish = async () => {
        if (workNameRef.current.value === '' || workTagsRef.current.value === '') {
            setAlerts([<AutoCloseAlert variant="warning">有选项未填写！</AutoCloseAlert>, ...alerts]);
            return;
        }
        await fetch(`/api/${work.lang}/${work.id}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: work.id,
                name: workNameRef.current.value,
                tags: workTagsRef.current.value,
                created_source: origin,
                thumbnail: thumbnailImageRef.current.src,
                hidden_code: 2,
                description: descriptionTextRef.current.value,
            }),
        });
        setIsShow(false);
        setAlerts([<AutoCloseAlert variant="suceess">已发布</AutoCloseAlert>, ...alerts]);
    };

    // 提交内容
    const workNameRef = React.useRef<HTMLInputElement>(null);
    const workTagsRef = React.useRef<HTMLInputElement>(null);
    const thumbnailImageRef = React.useRef<HTMLImageElement>(null);
    const descriptionTextRef = React.useRef<HTMLTextAreaElement>(null);
    const [origin, setOrigin] = React.useState<string>(work.created_source || 'original');

    const handleChangeOrigin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrigin(e.target.value);
    };

    return (
        <Modal show={isShow} centered={true}>
            <Modal.Header>
                <Modal.Title>发布作品</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="alert-list">{alerts}</div>
                <Row>
                    <Col sm={6}>
                        <p>作品封面</p>
                        <img
                            ref={thumbnailImageRef}
                            src={
                                work.thumbnail ||
                                'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                            }
                            alt="作品封面"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col sm={6}>
                        <Form.Label>*作品名称</Form.Label>
                        <Form.Control
                            ref={workNameRef}
                            type="text"
                            placeholder="请输入作品名称"
                            defaultValue={work.name}
                        />

                        <Form.Label>*作品来源</Form.Label>
                        <Form.Group>
                            <Form.Check
                                checked={origin === 'original'}
                                inline
                                onChange={handleChangeOrigin}
                                type="radio"
                                label="原创"
                                name="origin"
                                value="original"
                            />
                            <Form.Check
                                checked={origin === 'adapt'}
                                inline
                                onChange={handleChangeOrigin}
                                type="radio"
                                label="改编"
                                name="origin"
                                value="adapt"
                            />
                            <Form.Check
                                checked={origin === 'reprint'}
                                inline
                                onChange={handleChangeOrigin}
                                type="radio"
                                label="转载"
                                name="origin"
                                value="reprint"
                            />
                        </Form.Group>

                        <Form.Label>*作品标签（空格分开两个标签）</Form.Label>
                        <Form.Control
                            ref={workTagsRef}
                            type="text"
                            placeholder="请输入作品标签"
                            defaultValue={work.tags}
                        />

                        <Form.Label>作品介绍</Form.Label>
                        <Form.Control
                            ref={descriptionTextRef}
                            as="textarea"
                            cols={5}
                            rows={3}
                            placeholder="请输入作品介绍"
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => setIsShow(false)}>
                    返回
                </Button>
                <Button variant="primary" onClick={() => onClickPublish()}>
                    确定发布
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProjectPublishModal;
