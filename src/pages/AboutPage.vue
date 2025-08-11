<script setup lang="ts">
const infos = [
    {
        'type': '框架',
        'lib': 'Vue'
    },
    {
        'type': '路由库',
        'lib': 'Vue Router'
    },
    {
        'type': '原子库',
        'lib': 'Tailwind CSS'
    },
    {
        'type': 'UI 库',
        'lib': 'Vuetify'
    },
    {
        'type': '工具集',
        'lib': 'Lodash & Pinia'
    },
    {
        'type': '打包工具',
        'lib': 'Rolldown-Vite'
    },
]
</script>

<template>
    <v-container>
        <h1 style="font-size: 36px;">关于 NewXesFrontend</h1>
        <p>没什么好关于的，就是一个《简单》的前端项目。</p>
        <p>
            代码仓库：
            <a href="https://github.com/NewXesTeam/NewXesFrontend">https://github.com/NewXesTeam/NewXesFrontend</a>
        </p>
        <v-table>
            <thead>
                <tr>
                    <th>类型</th>
                    <th>使用的库</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="info in infos">
                    <th>{{ info.type }}</th>
                    <th>{{ info.lib }}</th>
                </tr>
            </tbody>
        </v-table>
    </v-container>
</template>

<style scoped></style>
