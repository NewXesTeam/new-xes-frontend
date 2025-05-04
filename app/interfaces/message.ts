import type { Emoji, Link } from './common';
import type { Medal } from './medal';

export interface MessageData {
    /** 数据 */
    data: {
        /** 消息类别 */
        category: number;
        /** 消息可读文字 */
        text: string;
        /** 消息数量 */
        count: number;
    }[];

    /** 状态码 */
    status: number;
    /** 状态信息 */
    msg: string;
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

interface Content {
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
    links: Link[];
    created_at: string;
    comment_from: string;
    username: string;
    user_avatar_path: string;
    reply_username: string;
    emojis: Emoji[];
}

export interface CommentDataItem {
    id: number;
    send_user_id: number;
    receive_user_id: number;
    title: null | string;
    content: {
        main: Content;
        sub: Content | null;
    };
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

export interface CommentMessageInfo {
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
        data: CommentDataItem[];
    };
}

export interface FollowDataItem {
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

export interface FollowMessageInfo {
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
        data: FollowDataItem[];
    };
}
