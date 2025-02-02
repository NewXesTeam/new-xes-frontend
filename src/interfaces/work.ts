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
    /** 评论帖子id，无论作品是否被下架此字段都存在 */
    topic_id: string;

    /** 作品类型 */
    project_type: 'scratch' | 'compiler' | 'code';
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

    /** 是否发布，0 未发布，1 发布，2 审核中，removed 已下架 */
    published: 0 | 1 | 2 | 'removed';
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

export interface WorkList {
    /** 作品列表 */
    data: Work[];

    /** 作品总数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    per_page: number;
}

export interface PublishWorkInfo {
    /** 作品ID */
    id: number;
    /** 作品名称 */
    name: string;
    category: number;
    /** 作品类型 */
    type: string;
    /** 作品描述 */
    description: string;
    /** 作者ID */
    user_id: number;
    /** 作品封面url */
    thumbnail: string;
    /** 作品代码 */
    xml: string;
    /** 作品语言 */
    lang: string;
    /** 作品发布状态 */
    published: number;
    /** 作品发布日期 */
    published_at: string;
    /** 作品最后修改日期 */
    modified_at: string;
    /** 作品点赞数 */
    likes: number;
    /** 作品观看数 */
    views: number;
    /** 作品评论数 */
    comments: number;
    /** 作品版本 */
    version: string;
    /** 作品来源 */
    source: string;
    original_id: number;
    weight: number;
    /** 删除日期 */
    deleted_at: string;
    /** 创建日期 */
    created_at: string;
    /** 更新日期 */
    updated_at: string;
    /** 改编的作品作者 */
    adapter: string;
    hidden_code: number;
    /** 是否删除 */
    removed: number;
    video: string;
    audio: string;
    /** 踩数 */
    unlikes: number;
    code_complete: number;
    source_code_views: number;
    /** 收藏数 */
    favorites: number;
    /** 标签 */
    tags: string;
    xml_path: string;
    /** 作品发布类型 */
    created_source: string;
    /** 热度 */
    popular_score: number;
    code_complete_json: string;
    live_id: null;
    template_project_id: null;
    /** 作者用户名 */
    username: string;
    /** 作者头像url */
    user_avatar: string;
    manual_weight: number;
    project_type: string;
    topic_id: string;
}