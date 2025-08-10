import * as React from 'react';
import {
    Container,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button,
    Badge,
    Tooltip,
    Tabs,
    Tab,
    Chip,
    CardActionArea,
    CardActions,
} from '@mui/material';
import { Pagination } from '@/components/Pagination';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishIcon from '@mui/icons-material/Unpublished';

import AppLayout from '@/layout/AppLayout';
import WorkList from '@/components/WorkList';
import ProjectPublishModal from '@/components/ProjectPublishModal';
import AutoCloseAlert from '@/components/AutoCloseAlert';
import { getWorkLink, getEditWorkLink } from '@/utils';
import { v4 as uuidV4 } from 'uuid';

import type { UserWorkList } from '@/interfaces/user';
import type { Work, PublishWorkInfo } from '@/interfaces/work';

const FixedWorkCard = (
    onClickPublish: (work: PublishWorkInfo) => void,
    onClickCancelPublish: (work: PublishWorkInfo) => void,
) => {
    return ({ work }: { work: Work }) => {
        const publishedText = { 0: '未发布', 1: '已发布', 2: '审核中', removed: '已下架' };
        const [isShowOperators, setIsShowOperators] = React.useState(false);
        let link = getWorkLink(work);
        let editLink = getEditWorkLink(work);
        let workStatus;

        if (work.removed) {
            workStatus = publishedText['removed'];
        } else {
            workStatus = publishedText[work.published as keyof typeof publishedText];
        }

        const statusColors = {
            未发布: 'default',
            已发布: 'success',
            审核中: 'info',
            已下架: 'error',
        };

        return (
            <Card
                className="relative"
                onMouseEnter={() => setIsShowOperators(true)}
                onMouseLeave={() => setIsShowOperators(false)}
            >
                <Tooltip placement="top" title={work.created_at}>
                    <CardActionArea onClick={() => window.open(link, '_blank')}>
                        <CardMedia
                            component="img"
                            alt={work.name.replace(/<em>|<\/em>/g, '')}
                            width={224}
                            height={168}
                            style={{ cursor: 'pointer' }}
                            src={
                                work.thumbnail ||
                                'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'
                            }
                        />

                        <Tooltip placement="bottom" title={work.name.replace(/<em>|<\/em>/g, '')}>
                            <CardContent>
                                <div className="text-neutral-600 truncate" style={{ fontSize: 20 }}>
                                    {work.name.replace(/<em>|<\/em>/g, '')}
                                </div>
                            </CardContent>
                        </Tooltip>
                    </CardActionArea>
                </Tooltip>

                <CardActions className="flex justify-between">
                    <Chip
                        label={workStatus}
                        size="small"
                        color={statusColors[workStatus as keyof typeof statusColors] as any}
                        variant="outlined"
                    />

                    <div className="flex gap-2" style={{ zoom: 0.75 }}>
                        <Badge badgeContent={work.views} color="info" aria-label="浏览量" showZero>
                            <VisibilityIcon />
                        </Badge>
                        <Badge badgeContent={work.likes} color="primary" aria-label="点赞数" showZero>
                            <FavoriteIcon />
                        </Badge>
                        <Badge badgeContent={work.unlikes} color="error" aria-label="点踩数" showZero>
                            <ThumbDownIcon />
                        </Badge>
                        <Badge badgeContent={work.comments} color="success" aria-label="评论数" showZero>
                            <CommentIcon />
                        </Badge>
                    </div>
                </CardActions>

                <div
                    className="absolute top-[8px] right-[8px] gap-1 z-10"
                    style={{ display: isShowOperators ? 'flex' : 'none' }}
                >
                    <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => window.open(editLink, '_blank')}
                        variant="contained"
                        color="primary"
                        sx={{ minWidth: 'auto', padding: '4px 8px' }}
                    >
                        编辑
                    </Button>

                    {work.published === 0 && !work.removed && (
                        <Button
                            size="small"
                            startIcon={<PublishIcon />}
                            onClick={() => {
                                let workData = work as unknown as PublishWorkInfo;
                                workData.created_source = 'original';
                                onClickPublish(workData);
                            }}
                            variant="contained"
                            color="success"
                            sx={{ minWidth: 'auto', padding: '4px 8px' }}
                        >
                            发布
                        </Button>
                    )}

                    {work.published === 1 && (
                        <Button
                            size="small"
                            startIcon={<UnpublishIcon />}
                            onClick={() => {
                                let workData = work as unknown as PublishWorkInfo;
                                onClickCancelPublish(workData);
                            }}
                            variant="contained"
                            color="error"
                            sx={{ minWidth: 'auto', padding: '4px 8px' }}
                        >
                            取消发布
                        </Button>
                    )}
                </div>
            </Card>
        );
    };
};

export default function UserPage() {
    const [type, setType] = React.useState('normal');
    const [lang, setLang] = React.useState('projects');
    const [status, setStatus] = React.useState('all');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageComponent, setPageComponent] = React.useState<React.ReactNode>(
        <Typography variant="h5">Loading...</Typography>,
    );
    const [showPublishModal, setShowPublishModal] = React.useState(false);
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);
    const publishWork = React.useRef<PublishWorkInfo>(null);

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            try {
                const response = await fetch(
                    `/api/${lang}/my?type=${type}&published=${status}&page=${currentPage}&per_page=20`,
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const responseData: UserWorkList = await response.json();

                if (responseData.data.total === 0) {
                    setPageComponent(
                        <Typography variant="h5" align="center" sx={{ py: 4 }}>
                            暂时没有作品，快去创作吧
                        </Typography>,
                    );
                    return;
                }

                setPageComponent(
                    <>
                        <WorkList
                            works={responseData.data.data}
                            enableRemoved={false}
                            WorkCardInterface={FixedWorkCard(
                                (work: PublishWorkInfo) => {
                                    publishWork.current = work;
                                    setShowPublishModal(true);
                                },
                                async (work: PublishWorkInfo) => {
                                    try {
                                        await fetch(`/api/${lang}/${work.id}/cancel_publish`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                params: {
                                                    id: work.id,
                                                },
                                            }),
                                        });
                                        setAlerts([
                                            <AutoCloseAlert key={uuidV4()} severity="success">
                                                已取消发布
                                            </AutoCloseAlert>,
                                            ...alerts,
                                        ]);
                                        setLang(work.lang);
                                    } catch (error) {
                                        setAlerts([
                                            <AutoCloseAlert key={uuidV4()} severity="error">
                                                取消发布失败，请重试
                                            </AutoCloseAlert>,
                                            ...alerts,
                                        ]);
                                    }
                                },
                            )}
                        />
                        {responseData.data.total > 20 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 20)}
                                    value={currentPage}
                                    handlePageChange={value => setCurrentPage(value)}
                                />
                            </Box>
                        )}
                    </>,
                );
            } catch (error) {
                setPageComponent(
                    <Typography variant="h5" align="center" sx={{ py: 4, color: 'error.main' }}>
                        加载失败，请刷新页面重试
                    </Typography>,
                );
            }
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [type, lang, status, currentPage, alerts]);

    const handleTypeChange = (event: React.SyntheticEvent, newValue: string) => {
        setType(newValue);
        setCurrentPage(1);
    };

    const handleLangChange = (event: React.SyntheticEvent, newValue: string) => {
        setLang(newValue);
        setCurrentPage(1);
    };

    const handleStatusChange = (event: React.SyntheticEvent, newValue: string) => {
        setStatus(newValue);
        setCurrentPage(1);
    };

    return (
        <>
            <Box
                className="alert-list"
                sx={{
                    position: 'fixed',
                    top: 80,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {alerts}
            </Box>

            {showPublishModal && publishWork.current && (
                <ProjectPublishModal
                    workInfo={publishWork.current}
                    isShow={showPublishModal}
                    setIsShow={setShowPublishModal}
                />
            )}

            <AppLayout>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Tabs value={type} onChange={handleTypeChange} sx={{ mb: 3 }}>
                        <Tab label="个人创作" value="normal" />
                        <Tab
                            label={
                                <Tooltip title="（隋唐练习）" placement="top">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>随堂练习</Box>
                                </Tooltip>
                            }
                            value="homework"
                        />
                    </Tabs>

                    <Card sx={{ mb: 3, boxShadow: 1 }}>
                        <CardContent sx={{ p: 3 }}>
                            <div className="flex gap-4 items-center">
                                <span>类型</span>

                                <Tabs
                                    value={lang}
                                    className="mb-2"
                                    onChange={handleLangChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    <Tab label="TurboWarp" value="projects" />
                                    <Tab label="Python" value="python" />
                                    <Tab label="C++" value="compilers" />
                                </Tabs>
                            </div>

                            <div className="flex gap-4 items-center">
                                <span>状态</span>

                                <Tabs
                                    value={status}
                                    className="mb-2"
                                    onChange={handleStatusChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    <Tab label="全部" value="all" />
                                    <Tab label="未发布" value="0" />
                                    <Tab label="审核中" value="2" />
                                    <Tab label="已发布" value="1" />
                                    <Tab label="已下架" value="removed" />
                                </Tabs>
                            </div>
                        </CardContent>
                    </Card>

                    {pageComponent}
                </Container>
            </AppLayout>
        </>
    );
}
