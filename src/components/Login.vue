<script setup lang="ts">
import {FormField, Form} from "jenesius-vue-form";
defineEmits(['login'])
const form = new Form()
</script>

<template>
  <label for="login">Имя пользователя:</label>
  <form-field name = "login" />
  <label for="password">Пароль:</label>
  <form-field name = "password" type = "password"/>
  <button @click = "$emit('login', { login: form.getValueByName('login'),
                           password: form.getValueByName('password') })">Войти</button>
</template>

<style scoped>

</style>