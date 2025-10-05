import type { Work, WorkList } from './work';

/** 用户信息 */
export interface UserInfo {
    /** 用户 ID */
    id: string;
    /** 用户 ID */
    user_id: string;
    /** 用户名 */
    name: string;

    /** 真名 */
    realname: string;
    /** 昵称 */
    nickname: string;
    /** 英文名 */
    en_name: string;
    /** 性别，1为男，2为女，3为未知 */
    sex: string;

    /** 头像 URL */
    avatar_path: string;
    /** 创建时间 */
    create_time: string;

    /** 年级 ID，如8 */
    grade_id: number;
    /** 年级名称，如 初一 */
    grade_name: string;
    /** 年级别名，如 chu1 */
    grade_alias: string;
}

export interface SimpleUserInfo {
    /** 用户 ID */
    id: string | number;
    /** 用户 ID */
    user_id: string | number;

    /** 是否关注 */
    is_follow: boolean;
    /** 是否被关注 */
    is_followed: boolean;

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

export interface UserList {
    /** 用户列表 */
    data: SimpleUserInfo[];

    /** 总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 当前页数 */
    current_page: number;
    /** 每页数量 */
    per_page: number;
}

export interface UserWorkList {
    /** 作品列表 */
    data: {
        /** 当前页码 */
        current_page: number;
    } & WorkList;
    /** 状态信息 */
    msg: string;
    /** 状态码 */
    status: number;
}

export interface UserAndWorkInfo {
    user: SimpleUserInfo;
    works: Work[];
}

export interface SearchUserList {
    total: number;
    page: number;
    per_page: number;
    data: UserAndWorkInfo[];
}

export interface SearchAllList {
    total?: number;
    page?: number;
    per_page?: number;
    data?: Work[];
    users?: SearchUserList;
    works?: WorkList;
}
