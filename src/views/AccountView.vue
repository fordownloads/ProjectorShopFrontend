<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { CONFIG } from '../config.ts'
import Input from '../components/Input.vue'

let error = ref(null)
let user = ref({})
const router = useRouter()
const updateAuthInfo = inject("updateAuthInfo")
const auth = inject("auth")

watch(auth, () => {
  console.log('user id: ', auth.value.id)
})

const update = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/users/me?info=true`, { method: 'post' })
    .then(x => x.json())
    .then((x) => {
      user.value = x
    })
    .catch((x) => (error.value = x));
};

const logout = () => {
  fetch(`${CONFIG.apiUrl}/users/logout`, { method: "POST" })
    .then((x) => {
      if (x.status === 200) {
        if (window.Android)
          window.Android.writeCookies()
        updateAuthInfo.invoke()
        router.push('/')
      } else error.value = "Ошибка";
    })
    .catch((x) => (error.value = x));
};

const updateProfile = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/users/edit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.value),
    }
  )
    .then((x) => x.json())
    .then((x) => {
      alert('Готово')
    })
    .catch((x) => (error.value = x));
};

const cp = () => {
  if (passRepeat.value !== password.value) {
    error.value = "Пароли не совпадают"
    return
  }
  error.value = null;
  fetch(`${CONFIG.apiUrl}/users/changepassword`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password.value }),
    }
  )
    .then((x) => {
      if (x.status === 200) {
        updateAuthInfo.invoke()
        router.push('/')
      } else error.value = "Проверьте правильность ввода данных";
    })
    .catch((x) => (error.value = x));
};

const password = ref("")
const passRepeat = ref("")

onMounted(update)
</script>
<template>
  <div class="wrap">
    <div class="form">
      <h1>Здравствуйте, {{ auth.login }}</h1>
      <button class="action-button" @click="logout">Выход</button>
      <h2>Изменить профиль</h2>
      <Input type="text" placeholder="Имя" v-model="user.firstname" />
      <Input type="text" placeholder="Фамилия" v-model="user.lastname" />
      <Input type="text" placeholder="Отчество" v-model="user.middlename" />
      <Input type="text" placeholder="Email" v-model="user.email" />
      <Input type="text" placeholder="Адрес" v-model="user.address" />
      <Input type="text" placeholder="Телефон" v-model="user.phone" />
      <button class="action-button" @click="updateProfile">Изменить профиль</button>
      <!--h2>Изменить пароль</h2>
          <input type="text" placeholder="Пароль" v-model="password" />
          <input type="text" placeholder="Повторите пароль" v-model="passRepeat" />
          <span v-if="error">{{ error }}</span>
          <button class="action-button" @click="cp">Изменить пароль</button-->
      <hr>
      <div class="mobile-footer">
        <RouterLink :class="{hide: !auth?.isAdmin}" to="/create">Администрирование</RouterLink>
        <RouterLink to="/contact">Контакты</RouterLink>
        <RouterLink to="/about">О нас</RouterLink>
      </div>
      <hr>
      <span class="mobile-footer">{{ CONFIG.accountPageBottomText }}</span>
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

.mobile-footer {
  justify-content: center;
  gap: 24px;
  opacity: 0.6;
  display: none;
  text-align: center;
}
@media (max-width: 800px) {
.mobile-footer {
  display: flex;
}
}
</style>
