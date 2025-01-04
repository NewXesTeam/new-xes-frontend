import React from 'react';
import { createRoot } from 'react-dom/client';
import { CaptchaPacket, LoginPacket } from './interfaces/login.ts';
import { Form, Row, Col, Button, InputGroup, Alert } from 'react-bootstrap';
import { checkLoggedIn } from './utils.ts';
import './styles/login.scss';

const LoginPage = () => {
    const [symbolValue, setSymbolValue] = React.useState('');
    const [passwordValue, setPasswordValue] = React.useState('');
    const [privacyValue, setPrivacyValue] = React.useState(false);

    const [captchaBase64, setCaptchaBase64] = React.useState('');
    const [captchaAnswer, setCaptchaAnswer] = React.useState('');

    const [errorValue, setErrorValue] = React.useState('');
    const [successValue, setSuccessValue] = React.useState('');

    const [visuallyValue, setVisuallyValue] = React.useState(true);
    const [passportReadOnly, setPassportReadOnly] = React.useState(false);
    const [requiredCaptcha, setRequiredCaptcha] = React.useState(false);

    const processCaptcha = async () => {
        const tokenCodeRequest = await fetch('/passport/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'client-id': '111101',
                'device-id': '_',
                'ver-num': '0.0.0',
            },
            body: `symbol=${symbolValue}&password=${passwordValue}&captcha=${captchaAnswer}`,
        });
        const tokenCodeResult: LoginPacket = await tokenCodeRequest.json();

        if (tokenCodeResult.errcode !== 0) {
            setErrorValue(tokenCodeResult.errmsg);
            setPassportReadOnly(false);
            setRequiredCaptcha(false);
            setVisuallyValue(true);
            setCaptchaAnswer('');
        } else {
            setSuccessValue('登录成功！正在跳转到主页...');

            await fetch('/passport/get_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'client-id': '111101',
                    'device-id': '_',
                    'ver-num': '0.0.0',
                },
                body: `code=${tokenCodeResult.data.code}`,
            });

            setTimeout(() => {
                location.href = '/';
            }, 500);
        }
    };

    const loginEvent = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (symbolValue.length !== 11) {
            setErrorValue('不合法的手机号！');
            return;
        } else if (passwordValue === '') {
            setErrorValue('密码不能为空！');
            return;
        } else if (requiredCaptcha && captchaAnswer === '') {
            setErrorValue('验证码不能为空！');
            return;
        } else if (!privacyValue) {
            setErrorValue('请阅读并同意相关协议！');
            return;
        } else {
            setErrorValue('');
        }

        if (requiredCaptcha) {
            await processCaptcha();
            return;
        }

        const captchaRequest = await fetch('/passport/captcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'client-id': '111101',
                'device-id': '_',
                'ver-num': '0.0.0',
            },
            body: `symbol=${symbolValue}&password=${passwordValue}&scene=3`,
        });
        const captchaResult: CaptchaPacket = await captchaRequest.json();

        setVisuallyValue(false);
        setPassportReadOnly(true);
        setRequiredCaptcha(true);
        setCaptchaBase64(captchaResult.data.captcha);
    };

    React.useEffect(() => {
        if (checkLoggedIn()) {
            setSuccessValue('您已登录！正在跳转到主页...');
            setTimeout(() => {
                location.href = '/';
            }, 500);
        }
    }, []);

    return (
        <>
            <Row className="justify-content-md-center width-100 height-100">
                <Col xs={12} sm={8} md={6} lg={4} className="login-form-container shadow margin-auto">
                    <h1>欢迎登录 NewXesFrontend</h1>

                    <Form onSubmit={loginEvent}>
                        <Alert variant="danger" hidden={errorValue ? false : true}>
                            {errorValue}
                        </Alert>
                        <Alert variant="success" hidden={successValue ? false : true}>
                            {successValue}
                        </Alert>

                        <InputGroup>
                            <InputGroup.Text>手机号</InputGroup.Text>
                            <Form.Control
                                type="number"
                                name="symbol"
                                title="手机号"
                                placeholder="13333333333"
                                disabled={passportReadOnly}
                                value={symbolValue}
                                onChange={event => setSymbolValue(event.target.value)}
                            />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Text>密码</InputGroup.Text>
                            <Form.Control
                                type="password"
                                name="password"
                                title="密码"
                                placeholder="123456"
                                disabled={passportReadOnly}
                                value={passwordValue}
                                onChange={event => setPasswordValue(event.target.value)}
                            />
                        </InputGroup>

                        <Form.Check
                            type="checkbox"
                            name="我已阅读并同意各种条款"
                            title="我已阅读并同意各种条款"
                            disabled={passportReadOnly}
                            label={
                                <div>
                                    我已阅读并同意
                                    <a
                                        href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/agreement"
                                        target="_blank"
                                    >
                                        《学而思网校用户协议》
                                    </a>
                                    、
                                    <a href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/privacy" target="_blank">
                                        《用户个人信息保护政策》
                                    </a>
                                    、
                                    <a
                                        href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/childpolicy"
                                        target="_blank"
                                    >
                                        《儿童个人信息保护规则》
                                    </a>
                                    、
                                    <a href="/eula.html" target="_blank">
                                        《NewXesFrontend 最终用户协议》
                                    </a>
                                    、
                                </div>
                            }
                            value={Number(privacyValue)}
                            onChange={event => setPrivacyValue(event.target.checked)}
                        />

                        <InputGroup hidden={visuallyValue}>
                            <InputGroup.Text>验证码</InputGroup.Text>
                            <InputGroup.Text>
                                <img src={captchaBase64} alt="验证码" />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                name="captcha"
                                title="验证码"
                                placeholder="abcd"
                                value={captchaAnswer}
                                onChange={event => setCaptchaAnswer(event.target.value)}
                            />
                        </InputGroup>

                        <Button type="submit" variant="primary">
                            登录
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

const dom: HTMLElement | null = document.getElementById('app');
if (dom) {
    const root = createRoot(dom);
    root.render(
        <React.StrictMode>
            <LoginPage />
        </React.StrictMode>,
    );
} else {
    throw new Error('Cannot find dom element #app');
}
