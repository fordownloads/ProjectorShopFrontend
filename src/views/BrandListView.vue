<script setup>
import { CONFIG } from "../config.ts";
import { RouterLink, useRoute } from "vue-router";
import { onMounted, ref, computed, watch } from "vue";
import BrandItem from "../components/BrandItem.vue";

const brands = ref(null);
const error = ref(null);

const page = computed(() => useRoute().query.page ?? 1);

const update = (offs) => {
  brands.value = null;
  error.value = null;
  fetch(`${CONFIG.apiUrl}/brands?page=${offs}`)
    .then((x) => x.json())
    .then((x) => {
      if (x.length === 0) {
        error.value = "Ничего нет";
        document.title = `Ошибка — ${CONFIG.appName}`;
      } else {
        brands.value = x;
        document.title = `Производители — ${CONFIG.appName}`;
      }
    })
    .catch((x) => (error.value = x));
};

onMounted(() => update(page.value));
watch(useRoute(), (x, y) => { if (y.path == "/brands") update(y.query.page ?? 1) });
</script>

<template>
  <div class="split">
    <section v-if="brands">
      <h1>
        Производители <small>страница {{ page }}</small>
      </h1>
      <div class="grid">
        <brand-item v-for="brand in brands" :key="brand" :brand="brand" />
      </div>
      <div class="button-block">
        <RouterLink
          class="action-button"
          v-if="page > 1"
          :to="{ path: 'brands', query: { page: +page - 1 } }">
          Назад
        </RouterLink>
        <RouterLink
          class="action-button"
          v-if="(brands.length == 30)"
          :to="{ path: 'brands', query: { page: +page + 1 } }">
          Вперед
        </RouterLink>
      </div>
    </section>
    <section v-else-if="error">
      <h1>Ошибка</h1>
      <span>{{ error }}</span>
      <div class="button-block">
        <RouterLink
          class="action-button"
          v-if="page > 1"
          :to="{ path: 'brands', query: { page: +page - 1 } }">
          Назад
        </RouterLink>
        <button class="action-button" @click="update(page)">Попробовать снова</button>
      </div>
    </section>
    <section v-else class="loading">
      <img src="@/assets/logo-load.svg" width="72" height="72" />
    </section>
  </div>
</template>

<style scoped>
.split {
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 0 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

small {
  font-weight: 400;
  color: #666;
  padding: 8px;
}

section {
  display: flex;
  flex-direction: column;
}

@media (max-width: 800px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
