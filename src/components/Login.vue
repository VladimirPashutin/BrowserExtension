<script setup lang="ts">
import {FormField, Form} from "jenesius-vue-form";
const props = defineProps<{errorMessage?: string}>();
const emits = defineEmits(['login','close']);
const form = new Form();
//@ts-ignore
const doLogin = (form) => {
  emits('login', { "login": form.getValueByName('login'),
                              "password": form.getValueByName('password') })
}
</script>

<template>
  <form class="loginForm">
    <div style="color: red">{{props.errorMessage}}</div>
    <label for="login">Имя пользователя:</label>
    <form-field type="text" name = "login"/>
    <label for="password">Пароль:</label>
    <form-field name = "password" type = "password" autocomplete="current-password" @keyup.enter="doLogin(form)"/>
    <button type="button" @click = "doLogin(form)">Войти</button>
    <button type="reset" @click = "$emit('close')">Закрыть</button>
  </form>
</template>

<style scoped>
  .loginForm {
    background-color: #f2f3f7;
    border: 1px solid black;
    position: fixed;
    left: 800px;
    top: 15px;
  }
</style>