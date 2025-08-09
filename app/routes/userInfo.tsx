import * as React from 'react';
import { Avatar, Container, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import { redirect } from 'react-router';
import NavbarComponent from '@/components/Navbar';

import type { UserInfo } from '@/interfaces/user';
import type { SpaceProfile } from '@/interfaces/space';
import type { Route } from './+types/userInfo';

export async function loader({ request }: Route.LoaderArgs) {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('is_login=1;') || false,
    };
}

export default function UserInfoPage({ loaderData }: Route.ComponentProps) {
    if (!loaderData.isLoggedIn) {
        redirect('/login');
        return null;
    }

    const [info, setInfo] = React.useState<React.JSX.Element | string>('Loading...');

    React.useEffect(() => {
        let ignore = false;

        const func = async () => {
            const infoResponse = await fetch('/api/user/info');
            const infoResponseData: UserInfo = await infoResponse.json();
            const spaceProfileResponse = await fetch(`/api/space/profile?user_id=${infoResponseData.data.user_id}`);
            const spaceProfileData: SpaceProfile = await spaceProfileResponse.json();

            const sexId = infoResponseData.data.sex;
            const sexName: string = ['男', '女', '未知'][Number(sexId) - 1];

            setInfo(
                <>
                    <div>
                        <Avatar
                            alt={infoResponseData.data.realname}
                            src={infoResponseData.data.avatar_path}
                            sx={{ width: 128, height: 128 }}
                        />
                        <h2>{infoResponseData.data.realname}</h2>
                        <h3 className="text-danger">
                            Dangerous: 消息中心的“点赞与收藏”部分的api有问题，会返回包括但不限于下面他人不可见的内容。
                        </h3>
                    </div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>属性</TableCell>
                                <TableCell>值</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component={'th'}>用户 ID</TableCell>
                                <TableCell>{infoResponseData.data.user_id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>用户名（他人不可见）</TableCell>
                                <TableCell>{infoResponseData.data.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>真名</TableCell>
                                <TableCell>{infoResponseData.data.realname}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>昵称（他人不可见）</TableCell>
                                <TableCell>{infoResponseData.data.nickname}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>英文名（他人不可见）</TableCell>
                                <TableCell>{infoResponseData.data.en_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>性别</TableCell>
                                <TableCell>{sexName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>头像 URL</TableCell>
                                <TableCell>{infoResponseData.data.avatar_path}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>创建时间（他人不可见）</TableCell>
                                <TableCell>{infoResponseData.data.create_time}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>年级名称（他人不可见）</TableCell>
                                <TableCell>{infoResponseData.data.grade_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>个人签名</TableCell>
                                <TableCell>{spaceProfileData.data.signature}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>关注数量</TableCell>
                                <TableCell>{spaceProfileData.data.follows}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component={'th'}>粉丝数量</TableCell>
                                <TableCell>{spaceProfileData.data.fans}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </>,
            );
        };

        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            <NavbarComponent />
            <Container className="mt-5">
                <h1>个人信息展示页面</h1>
                <hr />
                {info}
                <span className="d-block text-center width-100">「国之殇，未敢忘。——尸体的神韵」</span>
            </Container>
        </>
    );
}
