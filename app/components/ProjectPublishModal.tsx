import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Grid,
    TextField,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/UploadFile';
// @ts-ignore  // 这个不怨我
import Tags from '@yaireo/tagify/react';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import CryptoJS from 'crypto-js';

import type { PublishWorkInfo } from '@/interfaces/work';
import '@yaireo/tagify/dist/tagify.css';
import './ProjectPublishModal.scss';

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
    const [thumbnailImage, setThumbnailImage] = React.useState<string>(
        work.thumbnail || 'https://static0.xesimg.com/talcode/assets/py/default-python-thumbnail.png',
    );
    const [origin, setOrigin] = React.useState<string>(work.created_source || 'original');

    const workNameRef = React.useRef<HTMLInputElement>(null);
    const workTagsRef = React.useRef<string>('');
    const thumbnailUploadRef = React.useRef<HTMLInputElement>(null);
    const descriptionTextRef = React.useRef<HTMLTextAreaElement>(null);

    let lang = workInfo.lang;
    if (lang === 'webpy' || lang === 'python') {
        lang = 'python';
    } else if (lang === 'cpp') {
        lang = 'compilers';
    } else {
        lang = 'projects';
    }

    const onClickPublish = async () => {
        if (!workNameRef.current?.value || !workTagsRef.current) {
            setAlerts([
                <AutoCloseAlert key="warning" severity="warning">
                    有选项未填写！
                </AutoCloseAlert>,
                ...alerts,
            ]);
            return;
        }

        try {
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
                    description: descriptionTextRef.current?.value,
                }),
            });
            setIsShow(false);
            setAlerts([
                <AutoCloseAlert key="success" severity="success">
                    已发布
                </AutoCloseAlert>,
                ...alerts,
            ]);
        } catch (error) {
            setAlerts([
                <AutoCloseAlert key="error" severity="error">
                    发布失败，请重试
                </AutoCloseAlert>,
                ...alerts,
            ]);
        }
    };

    const handleChangeOrigin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrigin(e.target.value);
    };

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            let now_lang = lang;
            if (lang === 'python') now_lang = 'compilers';
            const response = await fetch(`/api/${now_lang}/${work.id}?id=${work.id}`);
            const responseData = await response.json();
            setWork(responseData.data);
            setOrigin(responseData.data.created_source || 'original');
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    const handleTagsChange = (event: any) => {
        const tags: { value: string }[] = event.detail.tagify.getCleanValue();
        let tag_str = '';
        tags.forEach(tag => {
            tag_str += tag.value.replaceAll(' ', '&nbsp;') + ' ';
        });
        workTagsRef.current = tag_str;
    };

    return (
        <Dialog open={isShow} onClose={() => setIsShow(false)} maxWidth="md" fullWidth>
            <DialogTitle>发布作品</DialogTitle>

            <DialogContent>
                <div className="alert-list">{alerts}</div>

                <Grid container sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        <DialogContentText sx={{ mb: 2 }}>作品封面</DialogContentText>
                        <div className="overflow-hidden rounded">
                            <img
                                src={thumbnailImage}
                                alt="作品封面"
                                style={{ width: '100%', height: '100%', display: 'block' }}
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={thumbnailUploadRef}
                            style={{ display: 'none' }}
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    const file = e.target.files[0];
                                    // @ts-ignore
                                    const FileExtension = file.name.split('.').pop().toLowerCase();
                                    reader.readAsArrayBuffer(file);
                                    reader.onload = async e => {
                                        if (e.target && e.target.result) {
                                            const ThumbnailImageArrayBuffer = e.target.result as ArrayBuffer;
                                            const wordArray = CryptoJS.lib.WordArray.create(ThumbnailImageArrayBuffer);
                                            const md5 = CryptoJS.MD5(wordArray).toString();

                                            const reader2 = new FileReader();
                                            reader2.readAsText(file);
                                            reader2.onload = async e => {
                                                if (md5 && e.target && e.target.result) {
                                                    const response = await fetch(
                                                        `/api/assets/get_tss_upload_params?filename=${md5}.${FileExtension}&md5=${md5}&scene=thumbnail`,
                                                    );
                                                    const responseData = await response.json();
                                                    await fetch(responseData.data.host, {
                                                        method: 'PUT',
                                                        headers: responseData.data.headers,
                                                        body: e.target.result,
                                                    });
                                                    setThumbnailImage(responseData.data.url);
                                                }
                                            };
                                        }
                                    };
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<UploadIcon />}
                            onClick={() => {
                                if (thumbnailUploadRef.current) {
                                    thumbnailUploadRef.current.click();
                                }
                            }}
                        >
                            上传封面
                        </Button>
                    </div>

                    <div style={{ flex: 1 }}>
                        <FormControl fullWidth required margin="normal">
                            <FormLabel>作品名称</FormLabel>
                            <TextField
                                inputRef={workNameRef}
                                placeholder="请输入作品名称"
                                defaultValue={work.name}
                                variant="outlined"
                            />
                        </FormControl>

                        <FormControl component="fieldset" fullWidth required margin="normal">
                            <FormLabel>作品来源</FormLabel>
                            <RadioGroup row value={origin} onChange={handleChangeOrigin} name="origin">
                                <FormControlLabel
                                    value="original"
                                    label="原创"
                                    control={<Radio />}
                                    disabled={work.created_source === 'adapt'}
                                />
                                <FormControlLabel
                                    value="adapt"
                                    label="改编"
                                    control={<Radio />}
                                    disabled={work.created_source !== 'adapt'}
                                />
                                <FormControlLabel
                                    value="reprint"
                                    label="转载"
                                    control={<Radio />}
                                    disabled={work.created_source === 'adapt'}
                                />
                            </RadioGroup>
                        </FormControl>

                        <FormControl fullWidth required margin="normal">
                            <FormLabel>作品标签</FormLabel>
                            <Tags
                                whitelist={['游戏', '动画', '故事', '模拟', '艺术', '教程', '其他']}
                                placeholder="添加标签"
                                settings={{ dropdown: { enabled: 0 } }}
                                onChange={handleTagsChange}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <FormLabel>作品介绍</FormLabel>
                            <TextField
                                inputRef={descriptionTextRef}
                                placeholder="请输入作品介绍"
                                multiline
                                rows={3}
                                variant="outlined"
                            />
                        </FormControl>
                    </div>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setIsShow(false)}>返回</Button>
                <Button onClick={onClickPublish} color="primary">
                    确定发布
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProjectPublishModal;
