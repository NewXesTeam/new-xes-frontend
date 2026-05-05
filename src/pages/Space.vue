<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAlertsStore } from '@/stores/alerts.ts';
import { useFetchData } from '@/utils';
import Loading from '@/components/common/Loading.vue';
import type { SpaceProfile } from '@/types/space.ts';
import type { ErrorResponse } from '@/types/common.ts';
import SpaceCoverTab from '@/components/space/SpaceCoverTab.vue';
import SpaceProjectsTab from '@/components/space/SpaceProjectsTab.vue';
import SpaceFavoritesTab from '@/components/space/SpaceFavoritesTab.vue';
import SpaceSocialTab from '@/components/space/SpaceSocialTab.vue';
import SpaceHomeTab from '@/components/space/SpaceHomeTab.vue';

const params = new URLSearchParams(location.search);

const alertsStore = useAlertsStore();
const props = defineProps<{
    spaceId: string;
}>();
const spaceTab = ref(params.get('tab') || 'home');

const [spaceData, loadSpaceData] = useFetchData<SpaceProfile>(() => `/api/space/profile?user_id=${props.spaceId}`);
const currentSignature = ref('');

const isUserFollowed = ref(false);
const isChangingSignature = ref(false);
const signatureInput = ref('');

const onClickFollow = async () => {
    await fetch('/api/space/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followed_space_id: props.spaceId, state: !isUserFollowed.value }),
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
    if (currentSignature.value === signatureInput.value){
        isChangingSignature.value = false;
        return;
    }

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

function setSpaceTab(tab: string) {
    spaceTab.value = tab;
}

watch(spaceTab, (newTab: string) => {
    const url = new URL(location.href);
    url.searchParams.set('tab', newTab);
    history.replaceState(null, '', url.toString());
});

onMounted(() => {
    loadSpaceData((data: SpaceProfile) => {
        currentSignature.value = data.signature;
        isUserFollowed.value = data.is_follow;
    });
});
</script>

<template>
    <v-container v-if="!spaceData.success">
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
                        class="signature-input max-w-125"
                        variant="outlined"
                        :hide-details="true"
                        autofocus
                        v-model="signatureInput"
                        @blur.native="onChangeSignature"
                        @keydown.enter="onChangeSignature"
                    />

                    <div v-else class="flex items-center">
                        <span style="font-size: 16px">
                            {{ currentSignature === '' ? spaceData.data?.signature || '暂无签名' : currentSignature }}
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

            <v-divider class="w-full h-px" />
        </div>

        <v-tabs-window v-model="spaceTab">
            <v-tabs-window-item value="home">
                <SpaceHomeTab :userId="props.spaceId" :setSpaceTab="setSpaceTab" />
            </v-tabs-window-item>
            <v-tabs-window-item value="cover">
                <SpaceCoverTab :userId="props.spaceId" />
            </v-tabs-window-item>
            <v-tabs-window-item value="projects">
                <SpaceProjectsTab :userId="props.spaceId" />
            </v-tabs-window-item>
            <v-tabs-window-item value="favorites">
                <SpaceFavoritesTab :userId="props.spaceId" />
            </v-tabs-window-item>
            <v-tabs-window-item value="social">
                <SpaceSocialTab :userId="props.spaceId" />
            </v-tabs-window-item>
        </v-tabs-window>
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
