/** 请求验证码返回类型 */
export interface CaptchaPacket {
    /** 数据 */
    data: {
        /** 验证码图片base64 */
        captcha: string;
    };

    /** 错误码 */
    errcode: number;
    /** 错误信息 */
    errmsg: string;
}

/** 获取令牌返回类型 */
export interface LoginPacket {
    /** 数据 */
    data: {
        /** 登录令牌 */
        code: string;
        /** 另一个tal登录令牌，未知用处 */
        passport_token: string;
    };

    /** 错误码 */
    errcode: number;
    /** 错误信息 */
    errmsg: string;
}

/** 登录请求返回类型，目前不需要 */
export interface TokenPacket {
    /** 数据 */
    data: {
        /** 类型 */
        code_type: 1;
        /** 跳转地址 */
        url: string;
    };

    /** 状态码 */
    stat: number;
}
