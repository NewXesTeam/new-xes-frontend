/** 用户信息 */
export interface UserInfo {
    /** 数据 */
    data: {
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
    };

    /** 状态码 */
    status: number;
    /** 状态信息 */
    msg: string;
}

export interface SimpleUserInfo {
    /** 用户 ID */
    id: string | number;
    /** 用户 ID */
    user_id: string | number;

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

export interface FollowUser {
    data: [];
    msg: string;
    status: number;
}
