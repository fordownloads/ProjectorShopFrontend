<script setup>
import { inject, ref } from 'vue';
import { useRouter } from "vue-router";
import { CONFIG } from '../config.ts'

let error = ref(null)
let user = ref({ login: "", password: "" })
const router = useRouter()
const updateAuthInfo = inject("updateAuthInfo")

const login = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/users/getToken`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.value),
    }
  )
    .then((x) => {
      if (x.status === 200) {
        if (window.Android)
          window.Android.writeCookies()
      updateAuthInfo.invoke()
      router.push('/')
      } else error.value = "Проверьте правильность ввода данных";
    })
    .catch((x) => (error.value = x));
};
</script>
<template>
  <div class="wrap">
    <div class="form">
    <h1>Вход</h1>
    <input type="text" placeholder="Логин" v-model="user.login" />
          <input type="password" placeholder="Пароль" v-model="user.password" />
          <span v-if="error">{{ error }}</span>
          <button class="action-button" @click="login">Вход</button>
          <RouterLink to="/register">Нет аккаунта? Зарегистрируйтесь</RouterLink>
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
input,
select {
  background: var(--dark-2);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--dark-3);
  color: #000;
}
</style>
