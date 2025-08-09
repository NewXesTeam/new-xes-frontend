import * as React from 'react';
import { Box, Button, TextField, Paper, Stack, CircularProgress, IconButton } from '@mui/material';
import { Save, Publish, Refresh } from '@mui/icons-material';
import AceEditor from '@/components/AceEditor';
import WSTerminal from '@/components/WSTerminal';
import ProjectPublishModal from '@/components/ProjectPublishModal';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import { getTemplate } from '@/utils';
import '@/styles/app.scss';

import type { BasicResponse } from '@/interfaces/common';
import type { PublishWorkInfo } from '@/interfaces/work';
import type { Route } from './+types/cpp';

export async function loader({ request }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
        userId: request.headers.get('Cookie')?.includes('stu_id=')
            ? request.headers.get('Cookie')?.split('stu_id=')[1].split(';')[0]
            : '1',
        id: new URL(request.url).searchParams.get('id') || '1',
    };
}

export default function IdeCppPage({ loaderData }: Route.ComponentProps) {
    React.useEffect(() => {
        if (!loaderData.isLoggedIn) {
            location.href = '/login.html';
        }
    }, [loaderData.isLoggedIn]);

    if (!loaderData.isLoggedIn) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                bgcolor: '#f5f7fa'
            }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    const { id } = loaderData;
    const [code, setCode] = React.useState<string>('');
    const [workName, setWorkName] = React.useState<string>('新作品');
    const [isShowPublishModal, setIsShowPublishModal] = React.useState<boolean>(false);
    const [workInfo, setWorkInfo] = React.useState<PublishWorkInfo>();
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const changeCode = (value: string) => {
        setCode(value);
    };

    const onClickSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/compilers/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: workName,
                    xml: code,
                    id: id === '1' ? null : Number(id),
                    lang: 'cpp',
                    type: '',
                    version: 'cpp',
                    user_id: id === '1' ? 8510061 : Number(loaderData.userId),
                    code_complete: 1,
                    original_id: 1,
                    planid: null,
                    problemid: null,
                    projectid: id === '1' ? null : Number(id),
                    removed: 0,
                    assets: {
                        assets: [],
                        cdns: ['https://static0.xesimg.com', 'https://livefile.xesimg.com'],
                        cursorsMap: {},
                        hide_filelist: false,
                    },
                }),
            });
            const responseData: BasicResponse<PublishWorkInfo> = await response.json();
            
            if (response.ok) {
                setAlerts(prev => [
                    <AutoCloseAlert severity="success" closeTimeout={5000} key={Date.now()}>
                        保存成功！
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2)
                ]);
            } else {
                setAlerts(prev => [
                    <AutoCloseAlert severity="error" closeTimeout={5000} key={Date.now()}>
                        保存失败，请重试
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2)
                ]);
            }
            
            return responseData.data;
        } catch (error) {
            setAlerts(prev => [
                <AutoCloseAlert severity="error" closeTimeout={5000} key={Date.now()}>
                    保存失败，请重试
                </AutoCloseAlert>,
                ...prev.slice(0, 2)
            ]);
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    React.useEffect(() => {
        let ignore = false;

        const loadProject = async () => {
            setIsLoading(true);
            try {
                if (id && id !== '1') {
                    const response = await fetch(`/api/compilers/v2/${id}?id=${id}`);
                    const responseData: BasicResponse<PublishWorkInfo> = await response.json();
                    if (!ignore) {
                        setCode(responseData.data.xml);
                        setWorkName(responseData.data.name);
                        setWorkInfo(responseData.data);
                    }
                } else {
                    const template = await getTemplate('cpp');
                    if (!ignore) {
                        setCode(template);
                    }
                }
            } catch (error) {
                setAlerts(prev => [
                    <AutoCloseAlert severity="error" closeTimeout={5000} key={Date.now()}>
                        加载失败，请刷新页面重试
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2)
                ]);
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadProject();
        return () => {
            ignore = true;
        };
    }, [id]);

    const handleRefreshTemplate = async () => {
        if (window.confirm('确定要刷新模板吗？当前未保存的更改将会丢失！')) {
            setIsLoading(true);
            try {
                const template = await getTemplate('cpp');
                setCode(template);
                setAlerts(prev => [
                    <AutoCloseAlert severity="info" closeTimeout={5000} key={Date.now()}>
                        模板已刷新
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2)
                ]);
            } catch (error) {
                setAlerts(prev => [
                    <AutoCloseAlert severity="error" closeTimeout={5000} key={Date.now()}>
                        刷新失败，请重试
                    </AutoCloseAlert>,
                    ...prev.slice(0, 2)
                ]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Box sx={{ 
            bgcolor: '#f0f2f5', 
            minHeight: '100vh',
            p: { xs: 1, md: 3 },
        }}>
            <div className='alert-list'>{alerts}</div>

            <Paper
                elevation={6}
                sx={{
                    width: '100%',
                    maxWidth: '1600px',
                    margin: '0 auto',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
            >
                <Box sx={{
                    bgcolor: '#ffffff', 
                    p: 2, 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)'
                }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={{ xs: 2, md: 3 }}
                        flexWrap="wrap"
                    >
                        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1}>
                            <TextField
                                id="work-name"
                                label="作品名称"
                                variant="outlined"
                                value={workName}
                                size="small"
                                onChange={e => setWorkName(e.target.value)}
                            />
                            
                            <IconButton 
                                size="small" 
                                color="default"
                                onClick={handleRefreshTemplate}
                                disabled={isLoading}
                                sx={{ 
                                    display: { xs: 'none', sm: 'flex' },
                                    '&:hover': {
                                        bgcolor: '#f1f5f9',
                                    }
                                }}
                                title="刷新模板"
                            >
                                <Refresh fontSize="small" />
                            </IconButton>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<Save fontSize="small" />}
                                onClick={async () => {
                                    const data = await onClickSave();
                                    if (data && String(data.id) !== id) {
                                        location.href = `/ide/cpp?id=${data.id}`;
                                    }
                                }}
                                disabled={isSaving || isLoading}
                                sx={{ 
                                    borderRadius: 1.5, 
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {isSaving ? <CircularProgress size={16} color="inherit" /> : '保存'}
                            </Button>
                            
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<Publish fontSize="small" />}
                                onClick={async () => {
                                    if (id === '1') {
                                        const data = await onClickSave();
                                        if (data) {
                                            location.href = `/ide/cpp?id=${data.id}`;
                                        }
                                    } else {
                                        const data = await onClickSave();
                                        if (data) {
                                            setWorkInfo(data);
                                            setIsShowPublishModal(true);
                                        }
                                    }
                                }}
                                disabled={isSaving || isLoading}
                                sx={{ 
                                    borderRadius: 1.5, 
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                发布
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                <Box sx={{
                    minHeight: 400,
                    position: 'relative',
                    padding: 2,
                }}>
                    {isLoading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            bgcolor: '#f8fafc'
                        }}>
                            <CircularProgress color="primary" />
                        </Box>
                    ) : (
                        <WSTerminal code={code} lang="cpp">
                            <AceEditor
                                value={code}
                                mode="c_cpp"
                                theme={'textmate'}
                                onChange={changeCode}
                                width="100%"
                                height="100%"
                                fontSize={16}
                                tabSize={4}
                            />
                        </WSTerminal>
                    )}
                </Box>
            </Paper>

            {id !== '1' && workInfo && (
                <ProjectPublishModal
                    isShow={isShowPublishModal}
                    setIsShow={setIsShowPublishModal}
                    workInfo={workInfo}
                />
            )}
        </Box>
    );
}
