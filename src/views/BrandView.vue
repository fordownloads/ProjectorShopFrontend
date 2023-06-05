<script setup>
import { CONFIG } from "../config.ts";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, inject, computed, watch } from "vue";
import ProductItem from "../components/ProductItem.vue";
import BrandItem from "../components/BrandItem.vue";
import BrandEditDialog from "../components/BrandEditDialog.vue";
const router = useRouter()

const auth = inject("auth")
const brand = ref(null);
const products = ref(null);
const brandError = ref(null);
const productError = ref(null);
const id = computed(() => useRoute().params.id);
const show = ref(false);

const update = () => {
  if (window.Android)
    window.Android.changeStatusBarColor(true)
  brand.value = null;
  brandError.value = null;
  products.value = null;
  fetch(`${CONFIG.apiUrl}/brands/${id.value}`)
    .then((x) => x.json())
    .then((x) => {
        brand.value = x;
        document.title = `${x.name} — ${CONFIG.appName}`;
        fetch(`${CONFIG.apiUrl}/products/bybrand/${id.value}`)
          .then((x) => x.json())
          .then((x) => {
            if (x.length === 0) productError.value = "Товары не найдены";
            else products.value = x;
          });
    })
    .catch((x) => (brandError.value = x));
};

const deleteBrand = () => {
  fetch(`${CONFIG.apiUrl}/brands/delete/${id.value}`, { method: 'POST' })
    .then((x) => {
      if (x.status === 500)
        alert("Удалите товары перед удалением производителя")
      else
        router.push('/');
    })
    .catch((x) => (brandError.value = x));
};


watch(show, (n, o) => {
  if (window.Android)
    window.Android.changeStatusBarColor(!n)
})

onMounted(update);
</script>

<template>
  <div class="split">
    <section v-if="brand">
      <div class="grid">
        <div class="brand">
          <brand-item :brand="brand" :justText="true" />
          <div v-if="brand.description != ''" class="brand-description">
            <h2>Описание</h2>
            <span>{{ brand.description }}</span>
          </div>
          <div class="button-block" v-if="auth?.isAdmin">
            <button @click="show=true" class="action-button">Редактировать описание</button>
            <button @click="deleteBrand()" class="action-button">Удалить</button>
          </div>
        </div>
        <section class="products" v-if="products">
          <product-item
            v-for="product in products"
            :key="product"
            :product="product"
          />
        </section>
      </div>
    </section>
    <section v-else-if="brandError">
      <h1>Ошибка</h1>
      <span>
        {{ brandError }}
      </span>
      <br /><br />
      <button class="action-button" @click="update()">Попробовать снова</button>
    </section>
    <section v-else class="loading">
      <img src="@/assets/logo-load.svg" width="72" height="72" />
    </section>
    <BrandEditDialog v-if="auth?.isAdmin && brand" :show="show" :brand="brand" @closeModal="show=false;update()" />
  </div>
</template>

<style scoped>
section { width: 100%; }

.brand {
  padding: 24px 0;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  align-items: center;
  gap: 16px;
    flex-wrap: wrap;
}

.brand-description {
  margin-left: 8px;
  border-left: 1px solid #666;
  padding-left: 32px;
}

.grid {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  align-items: stretch;
}

.split {
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
}

.products { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

a { color: #000; text-decoration: none; }

small {
  opacity: 0.75;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding-right: 8px;
  line-height: 2;
}

h2 { margin-top: 0; }
@media (max-width: 800px) {
  
.products {
  grid-template-columns: repeat(1, 1fr) !important;
}
.brand-description {
  border-left-width: 0;
}
.brand-description {
  padding-left: 118px;
}
}
</style>
