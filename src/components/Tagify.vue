<template>
    <v-combobox
        v-model="selectedTags"
        :items="settings?.whitelist || []"
        :label="settings?.placeholder || ''"
        multiple
        chips
        clearable
        @update:model-value="handleChange"
    ></v-combobox>
</template>

<script lang="ts">
export default {
    name: 'Tagify',
    emits: ['change'],
    props: {
        mode: String,
        settings: Object,
    },
    data() {
        return {
            selectedTags: [],
        };
    },
    methods: {
        handleChange() {
            this.$emit('change', {
                detail: {
                    tagify: {
                        getCleanValue: () => {
                            return this.selectedTags.map(item => ({ value: item }));
                        },
                    },
                },
            });
        },
    },
};
</script>

<style scoped></style>
