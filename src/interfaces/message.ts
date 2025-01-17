export interface MessageData {
    /** 数据 */
    data: Array<{
        category: number;
        text: string;
        count: number;
    }>;

    /** 状态码 */
    status: number;
    /** 状态信息 */
    msg: string;
}

interface ContentMain {
    id: number;
    topic_id: string;
    parent_id: number;
    target_id: number;
    user_id: string;
    reply_user_id: string;
    content: string;
    likes: number;
    unlikes: number;
    replies: number;
    top: number;
    removed: number;
    links: null | string;
    created_at: string;
    comment_from: string;
    username: string;
    user_avatar_path: string;
    reply_username: string;
    emojis: any[];
}

interface ContentSub {
    id: number;
    topic_id: string;
    parent_id: number;
    target_id: number;
    user_id: string;
    reply_user_id: string;
    content: string;
    likes: number;
    unlikes: number;
    replies: number;
    top: number;
    removed: number;
    links: null | string;
    created_at: string;
    comment_from: string;
    username: string;
    user_avatar_path: string;
    reply_username: string;
    emojis: any[];
}

interface Content {
    main: ContentMain;
    sub: ContentSub | null;
}

interface Topic {
    topic_id: string;
    project_id: string;
    link: string;
    text: string;
    thumbnail: string;
    lang: string;
    version: string;
    user_id: number;
    published: number;
    published_at: string;
    removed: number;
    resource_type: string;
}

export interface DataItem {
    id: number;
    send_user_id: number;
    receive_user_id: number;
    title: null | string;
    content: Content;
    status: number;
    category: number;
    subtype: string;
    source: number;
    topic_id: string;
    read_at: string;
    ext: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    sys_id: number;
    reply_status: number;
    send_username: string;
    send_user_avatar_path: string;
    topic: Topic;
    comment_id: number;
    has_reply: boolean;
}

export interface ContentInfo {
    stat: number;
    status: number;
    msg: string;
    data: {
        total: number;
        per_page: string;
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        from: number;
        to: number;
        data: DataItem[];
    };
}

interface Medal {
    id: number;
    user_id: number;
    medal_id: number;
    get_at: string;
    is_wear: number;
    name: string;
    thumbnail: string;
    thumbnail2: string;
    source_type: string;
    source_id: string;
    source_text: string;
    get_condition: string;
    source_link: string | null;
}

export interface DataItem2 {
    id: number;
    send_user_id: number;
    receive_user_id: number;
    title: null | string;
    content: null;
    status: number;
    category: number;
    subtype: string;
    source: number;
    topic_id: string;
    read_at: string;
    ext: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    sys_id: number;
    reply_status: number;
    send_username: string;
    send_user_avatar_path: string;
    follow_status: number;
    signature: string;
    medals: Medal[];
}

export interface FollowInfo {
    stat: number;
    status: number;
    msg: string;
    data: {
        total: number;
        per_page: string;
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        from: number;
        to: number;
        data: DataItem2[];
    };
}
