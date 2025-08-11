<script setup lang="ts">
import { useAppStore } from '@/stores/app.ts';
import { fetchData } from '@/utils.ts';
import type { MessageData } from '@/types/message.ts';
import { computed } from 'vue';
import SearchInput from '@/components/SearchInput.vue';

const store = useAppStore();
const messageData = fetchData<MessageData[]>("/api/messages/overview");
const messageTotal = computed(() => {
    if (messageData.value.error)
        return 0;
    return messageData.value.data?.reduce((acc, cur: MessageData) => acc + cur.count, 0);
})
</script>

<template>
    <v-app-bar style="position: static;" elevation="4">
        <div class="container mx-auto flex px-4 items-center">
            <router-link to="/" class="mr-2" style="font-size: 24px;">
                XesCoding
            </router-link>

            <div class="me-auto flex gap-2 items-center">
                <router-link v-slot="{ navigate, isActive }" to="/" custom>
                    <v-btn :active="isActive" @click="navigate">
                        首页
                    </v-btn>
                </router-link>

                <v-btn>
                    发现
                </v-btn>

                <v-btn>
                    关于
                </v-btn>
            </div>

            <div class="ms-auto flex gap-2 items-center">
                <SearchInput />

                <v-menu open-on-hover v-if="store.isLoggedIn">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props">
                            <v-badge inline color="error" :content="messageTotal || 0" :model-value="(messageTotal || 0) > 0">
                                消息
                            </v-badge>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="1">
                            <v-badge inline color="error" :content="messageData.data?.[0].count" :model-value="(messageTotal || 0) > 0">
                                评论和回复
                            </v-badge>
                        </v-list-item>
                        <v-list-item value="5">
                            <v-badge inline color="error" :content="messageData.data?.[2].count" :model-value="(messageTotal || 0) > 0">
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
                        <v-list-item value="space">
                            个人空间
                        </v-list-item>
                        <v-list-item value="user">
                            作品管理
                        </v-list-item>
                        <v-divider />
                        <v-list-item value="info">
                            个人信息
                        </v-list-item>
                        <v-divider />
                        <v-list-item value="logout">
                            登出
                        </v-list-item>
                    </v-list>
                </v-menu>

                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props">
                            创作
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item value="1">
                            TurboWarp
                        </v-list-item>
                        <v-divider />
                        <v-list-item value="5">
                            Python 基础
                        </v-list-item>
                        <v-list-item value="5">
                            Python 海龟
                        </v-list-item>
                        <v-list-item value="5">
                            Python 本地
                        </v-list-item>
                        <v-divider />
                        <v-list-item value="5">
                            C++
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </v-app-bar>
</template>

<style scoped></style>
