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
