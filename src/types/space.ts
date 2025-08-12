import type { Work, WorkList } from './work';
import type { UserList } from './user';

export interface SpaceProfile {
    /** 用户 ID */
    id: string | number;
    /** 用户 ID */
    user_id: string | number;

    /** 是否自己 */
    is_my: boolean;
    /** 是否关注 */
    is_follow: boolean;

    /** 真名 */
    realname: string;
    /** 头像 URL */
    avatar_path: string;
    /** 个人签名 */
    signature: string;

    /** 粉丝数量 */
    fans: number;
    /** 关注数量 */
    follows: number;
}

export interface SpaceIndex {
    /** 数据 */
    data: {
        /** 总览 */
        overview: {
            /** 总作品数 */
            works: number;
            /** 总浏览数 */
            views: number;
            /** 总喜欢数 */
            likes: number;
            /** 总收藏数 */
            favorites: number;
            /** 总改编数 */
            source_code_views: number;
        };

        /** 是否自己 */
        is_my: boolean;

        /** 代表作品 */
        representative_work: Work | null;

        /* 作品列表（前 10 个） */
        works: WorkList;
        /* 收藏列表（前 5 个） */
        favorites: WorkList;

        /** 关注列表（前 8 个） */
        follows: UserList;
        /** 粉丝列表（前 8 个） */
        fans: UserList;
    };

    /** 状态码 */
    status: number;
    /** 状态信息 */
    msg: string;
}

export interface SpaceCover {
    /** 数据 */
    data: {
        index_url: string;
        is_my: boolean;
        is_show_web_tab: boolean;
        remove_reason: string | null;
    };

    /** 状态码 */
    status: number;
    /** 状态信息 */
    msg: string;
}

export interface SpaceWorks {
    /** 数据 */
    data: WorkList;

    /** 状态码 */
    status: number;
    /** 状态信息 */
    msg: string;
}

export interface SpaceFavorites {
    /** 数据 */
    data: WorkList;

    /** 状态码 */
    status: number;
    /** 状态信息 */
    msg: string;
}

export interface SpaceSocial {
    /** 数据 */
    data: UserList;

    /** 状态码 */
    status: number;
    /** 状态信息 */
    msg: string;
}
