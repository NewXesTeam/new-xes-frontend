<script setup lang="ts">
import { VIconBtn } from 'vuetify/labs/VIconBtn';

interface Link {
    name: string;
    link: string;
    icon: string;
}

const links: Link[] = [
    {
        name: 'GitHub',
        link: 'https://github.com/NewXesTeam/new-xes-frontend',
        icon: 'mdi-github',
    },
];

const openLink = (link: string) => window.open(link, '_blank');
</script>

<template>
    <div class="flex justify-between bg-neutral-800 px-4 py-1">
        <div class="flex items-center text-white">
            <span>Copyright by NewXesTeam 2025</span>
        </div>
        <div class="flex items-center">
            <v-icon-btn
                class="text-white"
                theme="dark"
                v-for="link of links"
                :icon="link.icon"
                :title="link.name"
                :key="link.name"
                @click="openLink(link.link)"
                v-ripple
            />
        </div>
    </div>
</template>

<style scoped></style>
