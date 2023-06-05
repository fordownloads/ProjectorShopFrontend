<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { computed, onMounted, provide, ref } from "vue";
import { CONFIG } from "./config.ts";


const auth = ref({ auth: false })
provide("auth", auth)


const routes = computed(() =>
  useRouter()
    .getRoutes()
    .filter((r) => !r?.meta?.hide && !r?.meta?.hideDesktop)
);
const routesMobile = computed(() =>
  useRouter()
    .getRoutes()
    .filter((r) => !r?.meta?.hide && !r?.meta?.hideMobile && (r?.meta?.loggedIn === undefined || r?.meta?.loggedIn === auth.value.auth))
);
const currentRoute = computed(() => useRoute().path);
const showBackButton = computed(() => useRoute().meta?.back);

const updateAuthInfo = async () => {
  try {
    const me = await fetch(`${CONFIG.apiUrl}/users/me`, { method: 'post' })
    auth.value = await me.json()
  } catch (e) {
    alert('Ошибка при аутентификации')
    auth.value = { auth: false }
  }
}

const doBack = () => window.history.back()

provide("updateAuthInfo", { invoke: updateAuthInfo })
onMounted(updateAuthInfo)
</script>
<template>
  <div>
    <header>
      <nav>
        <svg xmlns="http://www.w3.org/2000/svg"
          :class="{ back: true, hide: !showBackButton }"
          height="48" viewBox="0 96 960 960" width="48" @click="doBack">
          <path d="M359 814 120 575l239-239 43 43-166 166h604v60H236l166 166-43 43Z"></path>
        </svg>
        <RouterLink to="/" class="logo">
          <img src="@/assets/logo.svg" width="36" height="36" />
          <div>
            <h1>{{ CONFIG.appName }}</h1>
            <span>Корма для ваших питомцев</span>
          </div>
        </RouterLink>
        <div class="links desktop-nav">
          <RouterLink
            v-for="route of routes"
            :to="route.path"
            :class="{ active: currentRoute == route.path, hide: !(route.meta?.admin !== true || (route.meta?.admin && auth.isAdmin)) }"
            :key="route.path">
            <svg v-if="route.meta?.icon" xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28">
              <path :d="route.meta?.icon"></path>
            </svg>
            {{ route.name }}
          </RouterLink>
          <RouterLink v-if="(auth?.auth !== true)" to="/login"
            :class="{ active: currentRoute == '/login', 'account-button': true }">
            Вход/Регистрация
          </RouterLink>
          <RouterLink v-else to="/account" :class="{ active: currentRoute == '/account', 'account-button': true }">
            {{ auth.login }}{{ auth.isAdmin ? "*" : "" }}
          </RouterLink>
        </div>
      </nav>
    </header>
    <div class="mobile-nav links">
      <RouterLink
        v-for="route of routesMobile"
        :to="route.path"
        :class="{ active: currentRoute == route.path, hide: !(route.meta?.admin !== true || (route.meta?.admin && auth.isAdmin)) }"
        :key="route.path">
        <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28">
          <path :d="route.meta?.icon"></path>
        </svg>
        {{ route.name }}
      </RouterLink>
    </div>
    <div class="main-content">
      <div>
        <RouterView />
      </div>
    </div>
  </div>
  <footer class="mobile-hide">
    <span>{{ CONFIG.desktopFooterText }}</span>
  </footer>
</template>
<style>
body,
input,
button {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.hide {
  display: none !important
}

footer {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 24px;
}
footer span {
  width: 1400px;
}

body {
  font-size: 15px;
  text-rendering: optimizeLegibility;
  background: var(--dark-0);
  color: #000;
  overflow: overlay;
  -webkit-tap-highlight-color: #0002;
  margin: 0;
}

* {
  box-sizing: border-box;
}

:root {
  --accent: #008dd4;
  --accent-trans: #008dd444;
  --dark-0: #f7f7f9;
  --dark-1: #f7f7f9;
  --dark-1-trans: #f7f7f9cc;
  --dark-2: #fafafa;
  --dark-3: #fff;
  --dark-4: #ccc;
  --shadow: #0001;
  --inset-top: 0px;
  --inset-bottom: 0px;
}

* {
  box-sizing: border-box;
}

.account-button {
  background: var(--dark-4);
  font-size: 80%;
  display: flex;
  align-items: center;
  margin-left: auto;
}

.action-button.secondary {
  background: #eee;
  color:#000;
  border-color: var(--dark-1)
}

.action-button {
  color: #fff;
  background: #000;
  padding: 8px 16px;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  border: 2px solid;
  transition: .2s ease;
  border-radius: 24px;
  text-align: center;
}

.action-button:hover {
  box-shadow: 0 0 0 2px #0006;
}

.button-block {
  display: flex;
  gap: 8px;
  margin: 16px 0 32px;
}

h2 {
  margin-bottom: 8px;
  margin-top: 16px;
}

.loading {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 64px;
}

.cart-button img {
  height: 24px;
  width: auto;
}

.cart-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-grow: 1;
}

.combo {
  display: flex;
  justify-content: center;
  gap:4px
}
.in-cart {
  border: 2px #000 solid;
  color: #000;
  background: #eee;
}
.desktop-hide {
  display: none;
}

@media (max-width: 800px) {
  .wrap {
    margin-inline: 24px;
  }
  .mobile-hide {
    display: none !important;
  }
  .desktop-hide {
    display: initial !important;
  }
}

a {
  color: #000;
}
</style>
<style scoped>
.back {
  margin-left: 12px;
  padding: 12px;
  display: none;
}

.back:active {
  border-radius: 80px;
  background: #eee;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--inset-top, 0) + 72px);
  display: flex;
  justify-content: center;
  background: var(--dark-1-trans);
  backdrop-filter: blur(10px);
  z-index: 10;
  padding-top: var(--inset-top, 0);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #000;
  margin-inline: 20px;
}

.logo div {
  line-height: 0.9;
}

.logo h1 {
  margin: 0;
  font-size: 1rem;
}

.logo span {
  font-weight: 300;
  font-size: 0.75rem;
}

.logo img {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 20px;
  gap: 14px;
}

.links {
  display: flex;
  gap: 0px;
  flex-shrink: 0;
  flex-grow: 1;
}

.links a {
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 80px;
  padding: 10px 20px;
  color: #000;
}

.desktop-nav a.active {
  background: var(--dark-3);
  box-shadow: 0 4px 16px 0 var(--shadow);
}
.desktop-nav a svg {
  width: 24px;
}
.desktop-nav a {
  display: flex;
  gap: 8px;
  align-items: center;
}
.mobile-nav a.active svg {
  box-shadow: 0 4px 16px 0 var(--shadow);
    width: 56px;
    border-radius: 16px;
    padding: 2px;
    background: #000;
    fill: #fff;
}

header>nav {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: flex-start;
  width: 1400px;
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  padding-bottom: var(--inset-bottom, 0);
  height: calc(72px + var(--inset-bottom, 0));
  justify-content: flex-start;
  width: 100%;
  background: var(--dark-1-trans);
  backdrop-filter: blur(10px);
  z-index: 10;
  display: none;
}

.main-content {
  display: flex;
  justify-content: center;
  margin-top: calc(var(--inset-bottom, 0) + 72px);
}

.main-content>div {
  margin-top: 24px;
  width: 1400px;
  display: flex;
}

@media (max-width: 800px) {
  .links a {
    font-size: .8rem;
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
    margin: 4px;
  }

  header .links,
  .logo span {
    display: none;
  }

  .main-content {
    margin-bottom: calc(var(--inset-bottom, 0) + 96px) !important;
  }

  .links svg {
    margin-bottom: 4px
  }

  .mobile-nav {
    display: flex;
  }

  .back {
    display: flex;
  }
}</style>