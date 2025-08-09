import * as React from 'react';
import {
    Badge,
    Card,
    Container,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
} from '@mui/material';
import AppLayout from '@/layout/AppLayout';
import { CommentList, FollowList } from '@/components/MessageList';
import { Pagination } from '@/components/Pagination';

import type { MessageData } from '@/interfaces/message';
import type { Route } from './+types/message';

export async function loader({ request, params }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
        category: params.category_id,
    };
}

export default function MessagePage({ loaderData }: Route.ComponentProps) {
    if (!loaderData.isLoggedIn) {
        location.href = '/login';
        return null;
    }

    const readMessages = async () => {
        const messageResponse = await fetch(`/api/messages/overview`);
        const messageResponseData: MessageData = await messageResponse.json();
        setMessageData(messageResponseData);
    };

    const category: string = loaderData.category;
    const [messages, setMessages] = React.useState<React.JSX.Element>(<Typography variant="h6">加载中...</Typography>);

    const [currentTab, setCurrentTab] = React.useState(category);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [messageData, setMessageData] = React.useState<MessageData | null>(null);

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            console.log(currentTab, typeof currentTab);
            const response = await fetch(`/api/messages?category=${currentTab}&page=${currentPage}&per_page=10`);
            const responseData = await response.json();

            await readMessages();

            if (responseData.data['total'] === 0) {
                setMessages(<Typography variant="h6">暂无消息</Typography>);
            } else {
                setMessages(
                    <>
                        {currentTab === '1' && (
                            <CommentList messages={responseData} onRead={readMessages}></CommentList>
                        )}
                        {currentTab === '5' && <FollowList messages={responseData} onRead={readMessages}></FollowList>}
                        {responseData.data.total > 10 && (
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Pagination
                                    pageCount={Math.ceil(responseData.data.total / 10)}
                                    value={currentPage}
                                    handlePageChange={page => {
                                        setCurrentPage(page);
                                    }}
                                />
                            </Box>
                        )}
                    </>,
                );
            }
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [currentTab, currentPage]);

    const handleTabChange = (eventKey: string) => {
        if (eventKey !== currentTab) {
            history.pushState(null, '', `/message/${eventKey}`);
            window.scrollTo(0, 0);
            setCurrentTab(eventKey);
            setCurrentPage(1);
        }
    };

    return (
        <AppLayout>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid
                        // xs={12}
                        // lg={2}
                        size={{ xs: 12, lg: 2 }}
                        sx={{
                            position: 'sticky',
                            top: '10px',
                            height: 'fit-content',
                            mb: 2,
                            zIndex: 1,
                        }}
                    >
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                消息中心
                            </Typography>
                            <List component="nav">
                                <ListItem disablePadding>
                                    <ListItemButton selected={currentTab === '1'} onClick={() => handleTabChange('1')}>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center">
                                                    评论和回复
                                                    <Badge
                                                        color="error"
                                                        badgeContent={messageData?.data[0].count}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton selected={currentTab === '5'} onClick={() => handleTabChange('5')}>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center">
                                                    关注
                                                    <Badge
                                                        color="error"
                                                        badgeContent={messageData?.data[2].count}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 10 }}>
                        <Typography variant="h4" gutterBottom>
                            {['评论和回复', '', '', '', '关注'][parseInt(currentTab) - 1]}
                        </Typography>
                        {messages}
                    </Grid>
                </Grid>
            </Container>
        </AppLayout>
    );
}
