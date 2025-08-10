import * as React from 'react';
import {
    Box,
    TextField,
    Button,
    Alert,
    Checkbox,
    FormControlLabel,
    Typography,
    Paper,
    InputAdornment,
    Container,
} from '@mui/material';
import { checkLoggedIn } from '@/utils';

import type { CaptchaPacket, LoginPacket } from '@/interfaces/login';
import '@/styles/login.css';

export default function LoginPage() {
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
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }}
                    className="login-form-container"
                >
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        欢迎登录 NewXesFrontend
                    </Typography>

                    <Box component="form" onSubmit={loginEvent} noValidate sx={{ mt: 1 }}>
                        {errorValue && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {errorValue}
                            </Alert>
                        )}

                        {successValue && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {successValue}
                            </Alert>
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="symbol"
                            label="手机号"
                            name="symbol"
                            autoComplete="tel"
                            autoFocus
                            disabled={passportReadOnly}
                            value={symbolValue}
                            onChange={event => setSymbolValue(event.target.value)}
                            slotProps={{
                                htmlInput: {
                                    type: 'text',
                                    placeholder: '13333333333',
                                    title: '手机号',
                                },
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="密码"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            disabled={passportReadOnly}
                            value={passwordValue}
                            onChange={event => setPasswordValue(event.target.value)}
                            slotProps={{
                                htmlInput: {
                                    placeholder: '123456',
                                    title: '密码',
                                },
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="privacy"
                                    color="primary"
                                    checked={privacyValue}
                                    disabled={passportReadOnly}
                                    onChange={event => setPrivacyValue(event.target.checked)}
                                />
                            }
                            label={
                                <Box component="div" sx={{ fontSize: '0.875rem' }}>
                                    我已阅读并同意
                                    <a
                                        href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/agreement"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ margin: '0 4px', color: '#1976d2' }}
                                    >
                                        《学而思网校用户协议》
                                    </a>
                                    、
                                    <a
                                        href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ margin: '0 4px', color: '#1976d2' }}
                                    >
                                        《用户个人信息保护政策》
                                    </a>
                                    、
                                    <a
                                        href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/childpolicy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ margin: '0 4px', color: '#1976d2' }}
                                    >
                                        《儿童个人信息保护规则》
                                    </a>
                                    、
                                    <a
                                        href="/eula"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ margin: '0 4px', color: '#1976d2' }}
                                    >
                                        《NewXesFrontend 最终用户协议》
                                    </a>
                                </Box>
                            }
                            sx={{ mt: 2, mb: 2 }}
                        />

                        {!visuallyValue && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="captcha"
                                label="验证码"
                                name="captcha"
                                value={captchaAnswer}
                                onChange={event => setCaptchaAnswer(event.target.value)}
                                slotProps={{
                                    htmlInput: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <img src={captchaBase64} alt="验证码" style={{ height: '40px' }} />
                                            </InputAdornment>
                                        ),
                                        placeholder: 'abcd',
                                        title: '验证码',
                                    },
                                }}
                            />
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            color="primary"
                        >
                            登录
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
