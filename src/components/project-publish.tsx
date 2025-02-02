import * as React from 'react';
import { Container, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import { checkLoggedIn } from '@/utils';
import { PublishWorkInfo } from '@/interfaces/work'
import '@/styles/common.scss';

const ProjectPublishModal = ({ work }: { work: PublishWorkInfo }) => {
    if (!checkLoggedIn()) {
        location.href = '/login.html';
        return null;
    }
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const [isShow, setIsShow] = React.useState<boolean>(true);
    const onClickPublish = async () => {
        if (workname.current.value === '' || worktags.current.value === '') {
            setAlerts([<AutoCloseAlert variant="warning">有选项未填写！</AutoCloseAlert>, ...alerts]);
            return;
        }
        await fetch(`/api/${work.lang}/${work.id}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: work.id,
                name: workname.current.value,
                tags: worktags.current.value,
                created_source: origin,
                thumbnail: thumbnailimg.current.src,
                hidden_code: 2,
                description: descriptionText.current.value,
            }),
        });
        setIsShow(false);
        setAlerts([<AutoCloseAlert variant="suceess">已发布</AutoCloseAlert>, ...alerts]);
    };

    // 提交内容
    const workname = React.useRef<HTMLInputElement>(null);
    const worktags = React.useRef<HTMLInputElement>(null);
    const thumbnailimg = React.useRef<HTMLImageElement>(null);
    const descriptionText = React.useRef<HTMLTextAreaElement>(null);
    const [origin, setOrigin] = React.useState<string>(work.created_source || 'original');
    const handleChangeOrigin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrigin(e.target.value);
    };

    return (
        <>
            <div className="alert-list">{alerts}</div>
            <Container className="mt-5">
                <Modal show={isShow} centered={true}>
                    <Modal.Header>
                        <Modal.Title>发布作品</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col style={{ width: '50%' }}>
                                <p>作品封面</p>
                                <img
                                    ref={thumbnailimg}
                                    src={
                                        work.thumbnail ||
                                        'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                                    }
                                    alt="作品封面"
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col style={{ width: '50%' }}>
                                <p>*作品名称</p>
                                <Form.Control
                                    ref={workname}
                                    type="text"
                                    placeholder="请输入作品名称"
                                    defaultValue={work.name}
                                />
                                <p>*作品来源</p>
                                <Form.Group>
                                    <Form.Check
                                        checked={origin === 'original'}
                                        inline
                                        onChange={handleChangeOrigin}
                                        type="radio"
                                        label="原创"
                                        name="origin"
                                        id="origin1"
                                        value={'original'}
                                        disabled={origin === 'adapt'}
                                    />
                                    <Form.Check
                                        checked={origin === 'adapt'}
                                        inline
                                        onChange={handleChangeOrigin}
                                        type="radio"
                                        label="改编"
                                        name="origin"
                                        id="origin2"
                                        value={'adapt'}
                                        disabled={origin !== 'adapt'}
                                    />
                                    <Form.Check
                                        checked={origin === 'reprint'}
                                        inline
                                        onChange={handleChangeOrigin}
                                        type="radio"
                                        label="转载"
                                        name="origin"
                                        id="origin3"
                                        value={'reprint'}
                                        disabled={origin === 'adapt'}
                                    />
                                </Form.Group>
                                <p>*作品标签（空格分开两个标签）</p>
                                <Form.Control
                                    ref={worktags}
                                    type="text"
                                    placeholder="请输入作品标签"
                                    defaultValue={work.tags}
                                />
                                <p>作品介绍</p>
                                <Form.Control
                                    ref={descriptionText}
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
            </Container>
        </>
    );
};

export default ProjectPublishModal;
