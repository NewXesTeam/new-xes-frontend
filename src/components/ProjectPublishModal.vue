<script setup lang="ts">
import { PublishWorkInfo } from '@/types/work';
import { ref } from 'vue';
import Tagify from './Tagify.vue';
import { useAlertsStore } from '@/stores/alerts';
import CryptoJS from 'crypto-js';

const { work } = defineProps<{ work: PublishWorkInfo }>();

const thumbnailImage = ref(
    work.thumbnail || 'https://static0.xesimg.com/talcode/assets/py/default-python-thumbnail.png',
);
const thumbnailUploadRef = ref<HTMLInputElement | null>(null);

const workName = ref(work.name);
const description = ref('');
const origin = ref(work.created_source || 'original');
const tagText = ref('');

const alertsStore = useAlertsStore();
const isActive = ref(false);

const handleTagsChange = (event: CustomEvent) => {
    const tags = event.detail.tagify.getCleanValue() || [];
    tagText.value = tags.map((t: { value: string }) => t.value.replace(/\s/g, '&nbsp;')).join(' ') + ' ';
};

let lang = work.lang;
if (lang === 'webpy' || lang === 'python') lang = 'python';
else if (lang === 'cpp') lang = 'compilers';
else lang = 'projects';

const handleThumbnailUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    try {
        const buffer = await file.arrayBuffer();
        const md5 = CryptoJS.MD5(CryptoJS.lib.WordArray.create(buffer)).toString();
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';

        const res = await fetch(`/api/assets/get_tss_upload_params?filename=${md5}.${ext}&md5=${md5}&scene=thumbnail`);
        const { data } = await res.json();

        await fetch(data.host, { method: 'PUT', headers: data.headers, body: buffer });

        thumbnailImage.value = data.url;
        alertsStore.addAlert({ type: 'success', text: '封面上传成功' });
    } catch (err) {
        alertsStore.addAlert({ type: 'error', text: '封面上传失败' });
    }

    (event.target as HTMLInputElement).value = '';
};

const triggerUpload = () => thumbnailUploadRef.value?.click();

const onClickPublish = async () => {
    if (!workName.value.trim() || !tagText.value.trim()) {
        alertsStore.addAlert({ type: 'warning', text: '有选项未填写！' });
        return;
    }

    try {
        await fetch(`/api/${lang}/${work.id}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: work.id,
                name: workName.value,
                tags: tagText.value.trimEnd(),
                created_source: origin.value,
                thumbnail: thumbnailImage.value,
                hidden_code: 2,
                description: description.value,
            }),
        });
        isActive.value = false;
        alertsStore.addAlert({ type: 'success', text: '已发布' });
        location.reload();
    } catch (error) {
        alertsStore.addAlert({ type: 'error', text: '发布失败，请重试' });
    }
};
</script>

<template>
    <v-dialog max-width="800" v-model="isActive">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                xSmall
                color="green"
                v-if="work.published === 0 && !work.removed"
                class="px-1 mr-1"
                v-bind="activatorProps"
            >
                <v-icon icon="mdi-publish"></v-icon>
                发布
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card>
                <v-card-text class="flex gap-4 flex-wrap">
                    <div class="flex-1">
                        <h4 class="font-weight-bold">作品封面</h4>
                        <div class="overflow-hidden rounded mb-3">
                            <v-img :src="thumbnailImage" height="200" cover alt="封面" />
                        </div>
                        <input
                            ref="thumbnailUploadRef"
                            type="file"
                            accept="image/*"
                            style="display: none"
                            @change="handleThumbnailUpload"
                        />
                        <v-btn color="primary" block @click="triggerUpload">
                            <v-icon icon="mdi-upload"></v-icon>
                            上传封面
                        </v-btn>
                    </div>

                    <div class="flex-1">
                        <v-form>
                            <v-text-field label="作品名称" v-model="workName" />

                            <v-radio-group label="作品来源" inline v-model="origin">
                                <v-radio label="原创" value="original" :disabled="work.created_source === 'adapt'" />
                                <v-radio label="改编" value="adapt" :disabled="work.created_source !== 'adapt'" />
                                <v-radio label="转载" value="reprint" :disabled="work.created_source === 'adapt'" />
                            </v-radio-group>

                            <Tagify
                                :settings="{
                                    whitelist: ['游戏', '动画', '故事', '模拟', '艺术', '教程', '其他'],
                                    placeholder: '添加标签',
                                }"
                                @change="handleTagsChange"
                            />

                            <v-textarea class="mt-4" label="作品描述" v-model="description" />
                        </v-form>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="isActive.value = false">取消</v-btn>
                    <v-btn color="success" @click="onClickPublish">发布</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped></style>
