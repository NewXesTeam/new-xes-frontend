<script setup lang="ts"></script>

<template>
    <div class="flex w-full h-full justify-center items-center">
        <v-card class="max-w-sm max-h-fit mx-auto">
            <v-card-title>
                <h2 style="font-size: 24px">404 Not Found</h2>
            </v-card-title>

            <v-card-text>
                <span class="text-neutral-600" style="font-size: 16px"> 页面走丢了... </span>
            </v-card-text>

            <v-card-actions>
                <router-link v-slot="{ navigate, isActive }" to="/" custom>
                    <v-btn :active="isActive" @click="navigate"> 前往首页 </v-btn>
                </router-link>
            </v-card-actions>
        </v-card>
    </div>
</template>

<style scoped></style>
