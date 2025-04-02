import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { UserInfo } from '@/interfaces/user';
import { SpaceProfile } from '@/interfaces/space';
import { checkLoggedIn } from '@/utils';
import { Table, Container } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';
import '@/styles/common.scss';

const UserInfoPage = () => {
    if (!checkLoggedIn()) {
        location.href = '/login.html';
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
                        <img src={infoResponseData.data.avatar_path} alt="头像" />
                        <h2>{infoResponseData.data.realname}</h2>
                        <h3 color="red">
                            Dangerous: 消息中心的“点赞与收藏”部分的api有问题，会返回包括但不限于下面他人不可见的内容。
                        </h3>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>属性</th>
                                <th>值</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>用户 ID</th>
                                <td>{infoResponseData.data.user_id}</td>
                            </tr>
                            <tr>
                                <th>用户名（他人不可见）</th>
                                <td>{infoResponseData.data.name}</td>
                            </tr>
                            <tr>
                                <th>真名</th>
                                <td>{infoResponseData.data.realname}</td>
                            </tr>
                            <tr>
                                <th>昵称（他人不可见）</th>
                                <td>{infoResponseData.data.nickname}</td>
                            </tr>
                            <tr>
                                <th>英文名（他人不可见）</th>
                                <td>{infoResponseData.data.en_name}</td>
                            </tr>
                            <tr>
                                <th>性别（他人不可见）</th>
                                <td>{sexName}</td>
                            </tr>
                            <tr>
                                <th>头像 URL</th>
                                <td>{infoResponseData.data.avatar_path}</td>
                            </tr>
                            <tr>
                                <th>创建时间（他人不可见）</th>
                                <td>{infoResponseData.data.create_time}</td>
                            </tr>
                            <tr>
                                <th>年级名称（他人不可见）</th>
                                <td>{infoResponseData.data.grade_name}</td>
                            </tr>
                            <tr>
                                <th>个人签名</th>
                                <td>{spaceProfileData.data.signature}</td>
                            </tr>
                            <tr>
                                <th>关注数量</th>
                                <td>{spaceProfileData.data.follows}</td>
                            </tr>
                            <tr>
                                <th>粉丝数量</th>
                                <td>{spaceProfileData.data.fans}</td>
                            </tr>
                        </tbody>
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
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(
        <React.StrictMode>
            <UserInfoPage />
        </React.StrictMode>,
    );
} else {
    throw new Error('Cannot find dom element #app');
}
