export interface ErrorResponse {
    /** 错误信息 */
    message: string;
    /** 状态码 */
    status_code: number;
}

export interface Emoji {
    id: string;
    url: string;
}
