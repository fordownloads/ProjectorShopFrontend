<script setup>
import { inject, ref } from 'vue';
import { useRouter } from "vue-router";
import { CONFIG } from '../config.ts'
import Input from '../components/Input.vue'

let error = ref(null)
let user = ref({ login: "", password: "" })
const router = useRouter()
const updateAuthInfo = inject("updateAuthInfo")

const login = () => {
  error.value = null;
  if (passRepeat.value !== user.value.password) {
  error.value = "Проверьте правильность ввода данных";
return}
  fetch(`${CONFIG.apiUrl}/users/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.value),
    }
  )
    .then((x) => {
      if (x.status === 200) {
      router.push('/login')
      } else error.value = "Проверьте правильность ввода данных";
    })
    .catch((x) => (error.value = x));
};

const passRepeat = ref("")
</script>
<template>
  <div class="wrap">
    <div class="form">
    <h1>Регистрация</h1>
    <Input type="text" placeholder="Логин" v-model="user.login" />
    <Input type="password" placeholder="Пароль" v-model="user.password" />
    <Input type="password" placeholder="Повторите пароль" v-model="passRepeat" />
    <span v-if="error">{{ error }}</span>
    <button class="action-button" @click="login">Регистрация</button>
  </div>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  gap: 8px;
}
.wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
