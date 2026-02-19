<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAppStore } from '@/stores/app';
import { useFetchData } from '@/utils';
import SearchInput from '@/components/SearchInput.vue';
import type { MessageData } from '@/types/message.ts';
import { refreshInfo } from '@/utils/passport';

type Theme = 'light' | 'dark' | 'system';

const store = useAppStore();
const themeMode = ref<Theme>('system');

const [messageData, loadMessageData] = useFetchData<MessageData[]>('/api/messages/overview');
const messageTotal = computed(() => {
    if (messageData.value.error) return 0;
    return messageData.value.data?.reduce((acc, cur: MessageData) => acc + cur.count, 0);
});
const mySpaceLink = computed(() => `/space/${store.userInfo?.user_id}/home`);

const onClickLogout = async () => {
    window.open('https://login.xueersi.com/newLogin/logout', '_blank');
    await refreshInfo();
};

const switchTheme = (theme: Theme) => {
    themeMode.value = theme;
    store.theme = theme;
};

const navigate = (path: string) => {
    location.href = `https://code.xueersi.com${path}`;
};

watch(
    () => store.loaded,
    loaded => {
        if (!loaded) return;
        themeMode.value = store.theme;
    },
);

onMounted(() => {
    loadMessageData();
});
</script>

<template>
    <v-app-bar style="position: static" elevation="4">
        <div class="container mx-auto flex px-4 items-center">
            <a href="/" class="mr-2" style="font-size: 24px"> XesCoding </a>

            <div class="me-auto flex gap-2 items-center">
                <v-btn @click="navigate('/')"> 首页 </v-btn>

                <v-btn @click="navigate('/search')"> 发现 </v-btn>

                <v-btn @click="navigate('/about')"> 关于 </v-btn>
            </div>

            <div class="ms-auto flex gap-2 items-center">
                <SearchInput />

                <v-menu open-on-hover v-if="store.isLoggedIn">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props">
                            <v-badge
                                inline
                                color="error"
                                :content="messageTotal || 0"
                                :model-value="(messageTotal || 0) > 0"
                            >
                                消息
                            </v-badge>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="1">
                            <v-badge
                                inline
                                color="error"
                                :content="messageData.data?.[0].count"
                                :model-value="(messageTotal || 0) > 0"
                            >
                                评论和回复
                            </v-badge>
                        </v-list-item>
                        <v-list-item value="5">
                            <v-badge
                                inline
                                color="error"
                                :content="messageData.data?.[2].count"
                                :model-value="(messageTotal || 0) > 0"
                            >
                                关注
                            </v-badge>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <v-menu open-on-hover v-if="store.isLoggedIn">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon aria-label="用户">
                            <v-avatar :image="store.userInfo?.avatar_path" />
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="space" @click="_ => navigate(mySpaceLink)"> 个人空间 </v-list-item>
                        <v-list-item value="user" @click="navigate('/user')"> 作品管理 </v-list-item>
                        <v-divider />
                        <v-list-item value="info" @click="navigate('/userInfo')"> 个人信息 </v-list-item>
                        <v-divider />
                        <v-list-item value="logout" @click="onClickLogout"> 登出 </v-list-item>
                    </v-list>
                </v-menu>

                <v-btn v-if="!store.isLoggedIn" @click="navigate('/login')"> 登录 </v-btn>

                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props"> 创作 </v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="turbowarp"> TurboWarp </v-list-item>
                        <v-divider />
                        <v-list-item value="python"> Python 基础 </v-list-item>
                        <v-list-item value="webpy"> Python 海龟 </v-list-item>
                        <v-list-item value="offline"> Python 本地 </v-list-item>
                        <v-divider />
                        <v-list-item value="cpp"> C++ </v-list-item>
                    </v-list>
                </v-menu>

                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props"> 主题 </v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="system" :active="themeMode === 'system'" @click="switchTheme('system')">
                            系统默认
                        </v-list-item>
                        <v-divider />
                        <v-list-item value="light" :active="themeMode === 'light'" @click="switchTheme('light')">
                            浅色
                        </v-list-item>
                        <v-list-item value="dark" :active="themeMode === 'dark'" @click="switchTheme('dark')">
                            深色
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </v-app-bar>
</template>

<style scoped></style>
