<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/app.ts';
import { useFetchData } from '@/utils/index.ts';
import SearchInput from '@/components/SearchInput.vue';
import type { MessageData } from '@/types/message.ts';
import { refreshInfo } from '@/utils/passport.ts';

const store = useAppStore();

const messageData = useFetchData<MessageData[]>('/api/messages/overview');
const messageTotal = computed(() => {
    if (messageData.value.error) return 0;
    return messageData.value.data?.reduce((acc, cur: MessageData) => acc + cur.count, 0);
});

const onClickLogout = async () => {
    await fetch('/passport/logout');
    await refreshInfo();
}
</script>

<template>
    <v-app-bar style="position: static" elevation="4">
        <div class="container mx-auto flex px-4 items-center">
            <router-link to="/" class="mr-2" style="font-size: 24px"> XesCoding </router-link>

            <div class="me-auto flex gap-2 items-center">
                <router-link v-slot="{ navigate, isActive }" to="/" custom>
                    <v-btn :active="isActive" @click="navigate"> 首页 </v-btn>
                </router-link>

                <v-btn> 发现 </v-btn>

                <router-link v-slot="{ navigate, isActive }" to="/about" custom>
                    <v-btn :active="isActive" @click="navigate"> 关于 </v-btn>
                </router-link>
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
                        <v-btn v-bind="props" icon>
                            <v-avatar :image="store.userInfo?.avatar_path" />
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="space"> 个人空间 </v-list-item>
                        <v-list-item value="user"> 作品管理 </v-list-item>
                        <v-divider />
                        <router-link v-slot="{ navigate, isActive }" to="/userInfo" custom>
                            <v-list-item value="info" :active="isActive" @click="_ => navigate()">
                                个人信息
                            </v-list-item>
                        </router-link>
                        <v-divider />
                        <v-list-item value="logout" @click="onClickLogout"> 登出 </v-list-item>
                    </v-list>
                </v-menu>

                <router-link v-slot="{ navigate, isActive }" to="/login" custom v-if="!store.isLoggedIn">
                    <v-btn :active="isActive" @click="navigate"> 登录 </v-btn>
                </router-link>

                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props"> 创作 </v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="1"> TurboWarp </v-list-item>
                        <v-divider />
                        <v-list-item value="5"> Python 基础 </v-list-item>
                        <v-list-item value="5"> Python 海龟 </v-list-item>
                        <v-list-item value="5"> Python 本地 </v-list-item>
                        <v-divider />
                        <v-list-item value="5"> C++ </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </v-app-bar>
</template>

<style scoped></style>
