/** 作品信息 */
export interface Work {
    /** 作品id */
    id: number;
    /** 作品名称 */
    name: string;
    /** 封面url */
    thumbnail: string;

    /** 原作id */
    original_id: number;
    /** 评论帖子id */
    topic_id: string;

    /** 作品类型 */
    project_type: 'scratch' | 'compiler';
    /** 作品语言 */
    lang: 'scratch' | 'python' | 'webpy' | 'cpp';
    /** 语言版本 */
    version: '3.0' | 'python' | 'webpy' | 'offline' | 'cpp';

    /** 创建者id */
    user_id: number;
    /** 创建者用户名 */
    username: string;
    /** 创建者头像url */
    user_avatar: string;

    /** 是否发布 */
    published: boolean;
    /** 是否删除 */
    removed: boolean;

    /** 作品创建日期 */
    created_at: string;
    /** 作品更新日期 */
    updated_at: string;
    /** 作品发布状态时最后修改日期 */
    modified_at: string;
    /** 作品发布日期 */
    published_at: string;
    /** 作品删除日期 */
    deleted_at: string;

    /** 作品浏览量 */
    views: number;
    /** 作品点赞数 */
    likes: number;
    /** 作品踩数 */
    unlikes: number;
    /** 作品收藏数 */
    favorites: number;
    /** 作品评论数 */
    comments: number;
    /** 作品源代码浏览量 */
    source_code_views: number;
}
