import * as React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import { PublishWorkInfo } from '@/interfaces/work';
import '@/styles/common.scss';

const ProjectPublishModal = ({
    workInfo,
    isShow,
    setIsShow,
}: {
    workInfo: PublishWorkInfo;
    isShow: boolean;
    setIsShow: (show: boolean) => void;
}) => {
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const [work, setWork] = React.useState<PublishWorkInfo>(workInfo);

    let lang = workInfo.lang;
    if (lang === 'webpy' || lang === 'python') {
        lang = 'python';
    } else if (lang === 'cpp') {
        lang = 'compilers';
    } else {
        lang = 'projects';
    }

    const onClickPublish = async () => {
        if (workNameRef.current.value === '' || workTagsRef.current === '') {
            setAlerts([<AutoCloseAlert variant="warning">有选项未填写！</AutoCloseAlert>, ...alerts]);
            return;
        }
        await fetch(`/api/${lang}/${work.id}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: work.id,
                name: workNameRef.current.value,
                tags: workTagsRef.current.trimEnd(),
                created_source: origin,
                thumbnail: thumbnailImage,
                hidden_code: 2,
                description: descriptionTextRef.current.value,
            }),
        });
        setIsShow(false);
        setAlerts([<AutoCloseAlert variant="suceess">已发布</AutoCloseAlert>, ...alerts]);
    };

    // 提交内容
    const workNameRef = React.useRef<HTMLInputElement>(null);
    const workTagsRef = React.useRef<string>(null);
    // const thumbnailImageRef = React.useRef<HTMLImageElement>(null);
    const [thumbnailImage, setThumbnailImage] = React.useState<string>(
        work.thumbnail || 'https://static0.xesimg.com/talcode/assets/py/default-python-thumbnail.png',
    );
    const descriptionTextRef = React.useRef<HTMLTextAreaElement>(null);
    const [origin, setOrigin] = React.useState<string>(work.created_source || 'original');

    const handleChangeOrigin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrigin(e.target.value);
    };
    const handleChangeTags = (e: React.ChangeEvent<HTMLInputElement>) => {
        // workTagsRef.current = e.target.value;
        // console.log(e.target.value);
        if (workTagsRef.current === null) workTagsRef.current = '';
        if (e.target.checked) {
            workTagsRef.current += e.target.value + ' ';
        } else {
            workTagsRef.current = workTagsRef.current.replace(e.target.value + ' ', '');
        }
        // console.log(workTagsRef.current);
    };

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            let now_lang = lang;
            if (lang === 'python') now_lang = 'compilers';
            const response = await fetch(`/api/${now_lang}/${work.id}?id=${work.id}`);
            const responseData = await response.json();
            setWork(responseData.data);
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

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
                        <img src={thumbnailImage} alt="作品封面" style={{ width: '100%' }} />
                    </Col>
                    <Col sm={6}>
                        <Form.Label>* 作品名称</Form.Label>
                        <Form.Control
                            ref={workNameRef}
                            type="text"
                            placeholder="请输入作品名称"
                            defaultValue={work.name}
                        />

                        <Form.Label>* 作品来源</Form.Label>
                        <Form.Group>
                            <Form.Check
                                checked={origin === 'original'}
                                inline
                                onChange={handleChangeOrigin}
                                type="radio"
                                label="原创"
                                name="origin"
                                value="original"
                                disabled={work.created_source === 'adapt'}
                            />
                            <Form.Check
                                checked={origin === 'adapt'}
                                inline
                                onChange={handleChangeOrigin}
                                type="radio"
                                label="改编"
                                name="origin"
                                value="adapt"
                                disabled={work.created_source !== 'adapt'}
                            />
                            <Form.Check
                                checked={origin === 'reprint'}
                                inline
                                onChange={handleChangeOrigin}
                                type="radio"
                                label="转载"
                                name="origin"
                                value="reprint"
                                disabled={work.created_source === 'adapt'}
                            />
                        </Form.Group>

                        <Form.Label>*作品标签（空格分开两个标签）</Form.Label>
                        {/* <Form.Control
                            ref={workTagsRef}
                            type="text"
                            placeholder="请输入作品标签"
                            defaultValue={work.tags}
                        /> */}
                        <Form.Group>
                            <Form.Check
                                inline
                                type="checkbox"
                                label="游戏"
                                value="游戏"
                                id="游戏"
                                defaultChecked={work.tags && work.tags.includes('游戏')}
                                onChange={handleChangeTags}
                            />
                            <Form.Check
                                inline
                                type="checkbox"
                                label="动画"
                                value="动画"
                                id="动画"
                                defaultChecked={work.tags && work.tags.includes('动画')}
                                onChange={handleChangeTags}
                            />
                            <Form.Check
                                inline
                                type="checkbox"
                                label="故事"
                                value="故事"
                                id="故事"
                                defaultChecked={work.tags && work.tags.includes('故事')}
                                onChange={handleChangeTags}
                            />
                            <Form.Check
                                inline
                                type="checkbox"
                                label="模拟"
                                value="模拟"
                                id="模拟"
                                defaultChecked={work.tags && work.tags.includes('模拟')}
                                onChange={handleChangeTags}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check
                                inline
                                type="checkbox"
                                label="艺术"
                                value="艺术"
                                id="艺术"
                                defaultChecked={work.tags && work.tags.includes('艺术')}
                                onChange={handleChangeTags}
                            />
                            <Form.Check
                                inline
                                type="checkbox"
                                label="教程"
                                value="教程"
                                id="教程"
                                defaultChecked={work.tags && work.tags.includes('教程')}
                                onChange={handleChangeTags}
                            />
                            <Form.Check
                                inline
                                type="checkbox"
                                label="其他"
                                value="其他"
                                id="其他"
                                defaultChecked={work.tags && work.tags.includes('其他')}
                                onChange={handleChangeTags}
                            />
                        </Form.Group>

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
