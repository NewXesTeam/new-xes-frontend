<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.ts';
import { useAlertsStore } from '@/stores/alerts.ts';
import { useFetchData } from '@/utils';
import Loading from '@/components/common/Loading.vue';
import type { SpaceProfile } from '@/types/space.ts';
import type { ErrorResponse } from '@/types/common.ts';

const store = useAppStore();
const alertsStore = useAlertsStore();
const route = useRoute();
const router = useRouter();
const spaceTab = ref(route.meta.space || 'home');

const [spaceData, loadSpaceData] = useFetchData<SpaceProfile>(`/api/space/profile?user_id=${route.params.userId}`);
const currentSignature = ref('');

const isUserFollowed = ref(false);
const isChangingSignature = ref(false);
const signatureInput = ref('');

const onClickFollow = async () => {
    await fetch('/api/space/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followed_user_id: route.params.userId, state: !isUserFollowed.value }),
    });
    isUserFollowed.value = !isUserFollowed.value;
    alertsStore.addAlert({
        type: 'success',
        text: isUserFollowed.value ? '关注成功' : '取消关注成功',
        useAutoClose: true,
    });
};

const onClickChangeSignature = () => {
    signatureInput.value = currentSignature.value;
    isChangingSignature.value = true;
};

const onChangeSignature = async () => {
    if (currentSignature.value === signatureInput.value) return;

    isChangingSignature.value = false;
    const response = await fetch('/api/space/edit_signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: signatureInput.value }),
    });

    if (response.ok) {
        currentSignature.value = signatureInput.value;
        alertsStore.addAlert({
            type: 'success',
            text: '更改签名成功',
            useAutoClose: true,
        });
    } else {
        const responseData: ErrorResponse = await response.json();
        alertsStore.addAlert({
            type: 'error',
            text: responseData.message,
            useAutoClose: true,
        });
    }

    signatureInput.value = '';
};

const signatureInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        onChangeSignature();
    } else if (event.key === 'Escape') {
        isChangingSignature.value = false;
        signatureInput.value = '';
    }
};

watch(
    () => store.loaded,
    loaded => {
        if (!loaded || !(route.params.userId === 'my')) return;

        router.push({
            name: route.name,
            params: {
                userId: store.userInfo?.user_id,
            },
        });
    },
);

watch(spaceTab, newTab => {
    router.push({
        name: `space.${newTab}`,
        params: route.params,
    });
});

watch(
    () => route.meta.space,
    newTab => {
        spaceTab.value = (newTab || 'home') as string;
    },
);

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        loadSpaceData();
    },
);

onMounted(() => {
    loadSpaceData();
});
</script>

<template>
    <v-container v-if="!spaceData.completed || spaceData.error">
        <Loading :error="spaceData.error" />
    </v-container>

    <div v-else class="flex flex-col flex-1 gap-2">
        <v-container class="flex flex-col gap-2">
            <div class="flex gap-2 items-center">
                <v-avatar :size="128" :image="spaceData.data?.avatar_path" />
                <div class="flex flex-1 flex-col gap-1">
                    <div class="flex items-baseline">
                        <h2 style="font-size: 24px">{{ spaceData.data?.realname }}</h2>
                        <span class="text-neutral-700 dark:text-neutral-300" style="font-size: 16px">
                            ({{ spaceData.data?.user_id }})
                        </span>
                    </div>

                    <v-text-field
                        v-if="isChangingSignature"
                        class="signature-input max-w-[500px]"
                        variant="outlined"
                        :hide-details="true"
                        autofocus
                        v-model="signatureInput"
                        @blur="onChangeSignature"
                        @keydown="signatureInputKeyDown"
                    />

                    <div v-else class="flex items-center">
                        <span style="font-size: 16px">
                            {{ currentSignature }}
                        </span>

                        <v-btn
                            v-if="spaceData.data?.is_my"
                            size="small"
                            variant="outlined"
                            color="primary"
                            @click="onClickChangeSignature"
                        >
                            修改签名
                        </v-btn>
                    </div>

                    <span style="font-size: 16px">
                        关注：{{ spaceData.data?.follows }} &nbsp; 粉丝：{{ spaceData.data?.fans }}
                    </span>
                </div>
                <div class="flex flex-col h-fit">
                    <v-btn
                        v-if="!spaceData.data?.is_my"
                        :variant="isUserFollowed ? 'outlined' : undefined"
                        :color="isUserFollowed ? 'secondary' : 'primary'"
                        @click="onClickFollow"
                    >
                        {{ isUserFollowed ? '已关注' : '关注' }}
                    </v-btn>
                </div>
            </div>
        </v-container>

        <div class="flex flex-col items-center">
            <v-tabs v-model="spaceTab" color="primary">
                <v-tab value="home">主页</v-tab>
                <v-tab value="cover">封面</v-tab>
                <v-tab value="projects">作品</v-tab>
                <v-tab value="favorites">收藏</v-tab>
                <v-tab value="social">社交</v-tab>
            </v-tabs>

            <v-divider class="w-full h-[1px]" />
        </div>

        <router-view v-slot="{ Component }">
            <transition name="slide-left" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<style>
/* 奇妙 智慧 Cascading Style Sheets（ */
.signature-input.signature-input input {
    --field-padding-x: 4px;
    --field-padding-y: 8px;

    --v-field-input-padding-top: var(--field-padding-x);
    --v-field-input-padding-bottom: var(--field-padding-x);
    --v-input-padding-top: var(--field-padding-x);
    --v-field-padding-bottom: var(--field-padding-x);
    --v-field-padding-start: var(--field-padding-y);
    --v-field-padding-end: var(--field-padding-y);
    --v-input-control-height: calc(24px + var(--v-input-padding-top) + var(--v-field-padding-bottom));
}
</style>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.25s ease-out;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
