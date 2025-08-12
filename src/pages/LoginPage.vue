<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.ts';
import type { LoginPacket } from '@/types/login.ts';
import type { CaptchaPacket } from '@/types/login.ts';

const store = useAppStore();
const router = useRouter();

const formRef = useTemplateRef("form");

const symbol = ref("");
const password = ref("");
const isAgreedPrivacy = ref(false);
const isAgreedEula = ref(false);
const captchaAnswer = ref("");

const isCaptchaVisible = ref(false);
const captchaBase64 = ref("");

const successMessage = ref("");
const errorMessage = ref("");

const phoneRule = (value: string) => {
    if (value.trim().length === 11 && !isNaN(parseInt(value)))
        return true;
    return "不合法的手机号！";
}

const captchaRule = (value: string) => {
    if (value.trim().length === 4)
        return true;
    return "不合法的验证码！";
}

const requiredRule = (message: string) => {
    return (value: any) => {
        if (value)
            return true;
        return message;
    }
}
const processCaptcha = async () => {
    const tokenCodeRequest = await fetch('/passport/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'client-id': '111101',
            'device-id': '_',
            'ver-num': '0.0.0',
        },
        body: new URLSearchParams({
            symbol: symbol.value,
            password: password.value,
            captcha: captchaAnswer.value,
        }).toString(),
    });
    const tokenCodeResult: LoginPacket = await tokenCodeRequest.json();

    if (tokenCodeResult.errcode !== 0) {
        errorMessage.value = tokenCodeResult.errmsg;
        captchaAnswer.value = "";
        isCaptchaVisible.value = false;
    } else {
        successMessage.value = '登录成功！正在跳转到主页...';
        errorMessage.value = "";

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
            router.push("/");
        }, 500);
    }
}

const getCaptcha = async () => {
    const captchaRequest = await fetch('/passport/captcha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'client-id': '111101',
            'device-id': '_',
            'ver-num': '0.0.0',
        },
        body: `symbol=${symbol.value}&password=${password.value}&scene=3`,
    });
    const captchaResult: CaptchaPacket = await captchaRequest.json();

    isCaptchaVisible.value = true;
    captchaBase64.value = captchaResult.data.captcha;
}

watch(() => store.loaded, () => {
    if (!store.isLoggedIn)
        return;
    successMessage.value = "您已登录！正在跳转到主页...";
    setTimeout(() => {
        router.push("/");
    }, 500);
})

watch([symbol, password], () => {
    isCaptchaVisible.value = false;
    captchaAnswer.value = "";
})

const onSubmit = (event: SubmitEvent) => {
    if (!formRef.value?.isValid)
        return;

    // console.log(symbol.value, password.value, isAgreedPrivacy.value, isAgreedEula.value, captchaAnswer.value)
    if (!isCaptchaVisible.value) {
        getCaptcha();
    } else {
        processCaptcha();
    }
}
</script>

<template>
    <div class="flex w-full h-full justify-center items-center">
        <v-card class="min-w-sm max-h-fit mx-auto" elevation="8">
            <v-card-title>
                <h2 class="w-full text-center" style="font-size: 24px;">
                    欢迎登录 NewXesFrontend
                </h2>
            </v-card-title>

            <v-divider />

            <v-card-text>
                <v-form class="flex flex-col gap-2" @submit.prevent="onSubmit" ref="form">
                    <v-alert v-if="successMessage" :text="successMessage" type="success" />
                    <v-alert v-if="errorMessage" :text="errorMessage" type="error" />

                    <v-text-field
                        v-model="symbol"
                        type="text"
                        label="手机号"
                        name="symbol"
                        hide-details="auto"
                        :rules="[phoneRule]"
                    />

                    <v-text-field
                        v-model="password"
                        type="password"
                        label="密码"
                        name="password"
                        hide-details="auto"
                        :rules="[requiredRule('密码不能为空！')]"
                    />

                    <v-text-field
                        v-model="captchaAnswer"
                        type="text"
                        label="验证码"
                        hide-details="auto"
                        :rules="[captchaRule]"
                        v-if="isCaptchaVisible"
                    >
                        <template v-slot:append>
                            <!--<span>我是...终将升起的<del>烈阳</del>验证码！（</span>-->
                            <img :src="captchaBase64" class="h-[40px]" alt="验证码" />
                        </template>
                    </v-text-field>

                    <v-checkbox
                        v-model="isAgreedPrivacy"
                        hide-details="auto"
                        :rules="[requiredRule('请阅读并同意相关协议！')]"
                    >
                        <template v-slot:label>
                            <div>
                                我已阅读并同意以下条款：
                                <div class="flex flex-col" style="font-size: 12px;">
                                    <a
                                        href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/agreement"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style="margin: 0 4px; color: #1976d2;"
                                    >
                                        《学而思网校用户协议》、
                                    </a>
                                    <a
                                        href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style="margin: 0 4px; color: #1976d2;"
                                    >
                                        《用户个人信息保护政策》、
                                    </a>
                                    <a
                                        href="https://app.xueersi.com/xueersi-mall-hm-xbjtoxes/childpolicy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style="margin: 0 4px; color: #1976d2;"
                                    >
                                        《儿童个人信息保护规则》
                                    </a>
                                </div>
                            </div>
                        </template>
                    </v-checkbox>

                    <v-checkbox
                        v-model="isAgreedEula"
                        hide-details="auto"
                        :rules="[requiredRule('请阅读并同意本协议！')]"
                    >
                        <template v-slot:label>
                            <div>
                                我已阅读并同意 <br>
                                <a
                                    href="/eula"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style="margin: 0 4px; color: #1976d2; font-size: 12px;"
                                >
                                    《NewXesFrontend 最终用户协议》
                                </a>
                            </div>
                        </template>
                    </v-checkbox>

                    <v-btn type="submit" color="primary">登录</v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped>

</style>
