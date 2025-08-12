<script setup lang="ts">
const eula = `我们感谢您选择使用 NewXesFrontend 平台！
我们与您一样，也不想面对巨长的用户协议。

但是，为了让您更好地使用 NewXesFrontend 平台，我们需要您阅读并理解以下条款：

一、免责声明
NewXesFrontend 平台仅提供服务，不提供任何形式的保证，不保证服务的可用性、安全性、准确性、完整性、可靠性、及时性、可追溯性。
NewXesFrontend 平台不对因服务引起的任何损失承担责任，包括但不限于因服务中断或其它缺陷引起的损失。
NewXesFrontend 平台不对用户的 学而思 账号负责，包括但不限于账号被封等等。

二、服务内容
NewXesFrontend 平台为用户提供 学而思编程社区 第三方的网页端。

三、解释权
本协议解释权归 NewXesTeam 团队所有。`;
</script>

<template>
    <v-container>
        <h1 style="font-size: 24px">NewXesFrontend 最终用户协议</h1>
        <p v-for="(line, index) in eula.split('\n')" :key="index" style="font-size: 16px">{{ line }}</p>
    </v-container>
</template>

<style scoped></style>
