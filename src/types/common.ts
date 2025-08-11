export interface ErrorResponse {
    /** 错误信息 */
    message: string;
    /** 状态码 */
    status_code: number;
}

export interface BasicResponse<DataInterface> {
    /** 数据 */
    data: DataInterface;
    /** 状态信息 */
    msg: string;
    /** 状态码 */
    status: number;
}

export interface Emoji {
    id: string;
    url: string;
}

export interface Link {
    link: string;
    text: string;
}

export interface AssociateWord {
    word: string;
}
