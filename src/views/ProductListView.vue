<script setup>
import { CONFIG } from "../config.ts";
import { onMounted, ref, computed, watch, inject } from "vue";
import ProductItem from "../components/ProductItem.vue";
import { RouterLink, useRoute } from "vue-router";

const cart = ref(null);
const products = ref(null);
const error = ref(null);
const auth = inject("auth")

const page = computed(() => useRoute().query.page ?? 1);

const update = (offs) => {
  products.value = null;
  error.value = null;
  fetch(`${CONFIG.apiUrl}/products?page=${offs}&idList=null`)
    .then((x) => x.json())
    .then((x) => {
      document.title = CONFIG.appName;
      if (x.length === 0) {
        error.value = "Товары не найдены";
      } else {
        if (auth.value.auth)
          getCart()
            .then(c => {
              const guids = c.map(y => y.productId)
              products.value = x.map(p => ({ ...p, inCart: guids.indexOf(p.id) >= 0 }));
            })
        else
          products.value = x;
      }
    })
    .catch((x) => (error.value = x));
};

const getCart = () =>
    fetch(`${CONFIG.apiUrl}/cart`)
        .then(x => x.json())

onMounted(() => update(page.value));
watch(useRoute(), (x, y) => { if(y.path == "/") update(y.query.page ?? 1) });
</script>

<template>
  <div class="split">
    <section v-if="products?.length == 0">
      <h1>Здесь пусто</h1>
    </section>
    <section v-if="products">
      <img src="/banner.jpg" alt="" class="banner">
      <h1>
        Товары <small>страница {{ page }}</small>
      </h1>
      <div class="button-block">
        <RouterLink
          class="action-button"
          v-if="page > 1"
          :to="{ path: '/', query: { page: +page - 1 } }">
          Назад
        </RouterLink>
        <RouterLink
          class="action-button"
          v-if="(products.length == 30)"
          :to="{ path: '/', query: { page: +page + 1 } }">
          Вперед
        </RouterLink>
      </div>
      <div class="grid">
        <ProductItem
          @update="e => update(page)"
          :show-goto-cart="true" :product="product" :in-cart="product.inCart" :login="auth.auth"
          v-for="product in products" :key="product" />
      </div>
      
    </section>
    <section v-else-if="error">
      <h1>Ошибка</h1>
      <span>{{ error }}</span>
      <div class="button-block">
        <RouterLink
          class="action-button"
          v-if="page > 1"
          :to="{ path: '/', query: { page: +page - 1 } }">
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
.banner {
  width: 100%;
    border-radius: 48px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.split {
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 0 16px;
}

small {
  font-weight: 400;
  color: #666;
  padding: 8px;
}
@media (max-width: 800px) {
  
.grid {
  grid-template-columns: repeat(1, 1fr);
}
}
</style>
