<script setup>
import { CONFIG } from "../config.ts";
import { onMounted, ref, computed, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ManagementTabs from '../components/ManagementTabs.vue'

const products = ref(null);
const error = ref(null);
const currentSpecies = ref("null");
const speciesList = [
  ["null", "Все"],
  ["Кот", "Кошачьи"],
  ["Собака", "Собаки"],
  ["Хомяк", "Хомяки"]
]

const page = computed(() => useRoute().query.page ?? 1);

const update = (offs, species) => {
  error.value = null;
  currentSpecies.value = species ?? "null";
  fetch(`${CONFIG.apiUrl}/products?page=${offs}&limit=50&species=${species}&idList=null`)
    .then((x) => x.json())
    .then((x) => {
      document.title = CONFIG.appName;
      if (x.length === 0) {
        error.value = "Товары не найдены";
      } else {
        products.value = x;
      }
    })
    .catch((x) => (error.value = x));
};

const deleteProduct = (id) => {
  fetch(`${CONFIG.apiUrl}/products/delete/${id}`, { method: 'POST' })
    .then((x) => {
      if (x.status !== 200)
        error.value = x.statusText
    })
    .catch((x) => (error.value = x));
};

onMounted(() => update(page.value, currentSpecies.value));
watch(useRoute(), (x, y) => { if(y.path == "/management/products") update(y.query.page ?? 1, y.query.species ?? "null") });
</script>

<template>
  <div class="split">
    <section v-if="products?.length == 0">
      <h1>Здесь пусто</h1>
    </section>
    <section v-if="products">
      <ManagementTabs />
      <div class="button-block">
        <RouterLink
          class="action-button"
          to="/products/create">
          <img src="@/assets/add.svg">Создать...
        </RouterLink>
        <RouterLink
          class="action-button"
          v-if="page > 1"
          :to="{ path: '/management/products', query: { page: +page - 1, species: currentSpecies } }">
          Назад
        </RouterLink>
        <RouterLink
          class="action-button"
          v-if="(products.length == 30)"
          :to="{ path: '/management/products', query: { page: +page + 1, species: currentSpecies } }">
          Вперед
        </RouterLink>
        <RouterLink
            v-for="s in speciesList" :key="s[0]"
            :class="{ secondary: currentSpecies != s[0], 'action-button':true }"
            :to="{ path: '/management/products', query: { species: s[0] } }">
            {{ s[1] }}</RouterLink>
      </div>
      <table>
        <tr>
          <th>Название</th>
          <th>Цена (руб.)</th>
          <th>Вес (грамм)</th>
          <th>Животное</th>
          <th></th>
        </tr>
        <tr v-for="product in products" :key="product" @click="">
          <td>{{ product.brand.name + " " + product.name }}</td>
          <td>{{ product.available ? product.priceKopeck /100 : 'Нет в наличии' }}</td>
          <td>{{ product.weightG }}</td>
          <td>{{ product.species }}</td>
          <td class="actions">
            <div>
              <RouterLink :to="{ path: `/products/${product.id}` }"><img src="@/assets/open.svg"></RouterLink>&nbsp;
              <RouterLink :to="{ path: `/products/${product.id}`, query: { edit: true } }"><img src="@/assets/edit.svg"></RouterLink>&nbsp;
              <a @click="deleteProduct(product.id);update(page, currentSpecies)"><img src="@/assets/del-black.svg"></a>
            </div>
          </td>
        </tr>
      </table>
      
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
.action-button {
  display: flex;
  align-items: center;
}
section {
  width: 100%;
}
table img {
  width: 24px;
}
.actions div {
  display: flex;

}
.actions {
  width: 0;
}
table {
  border-collapse: collapse;
  width: 100%;
}

table td, table th {
  border: 1px solid #ddd;
  padding: 8px;
}

table tr:nth-child(even){background-color: #f2f2f2;}

table tr:hover {background-color: #ddd;}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #000;
  color: white;
}

.split {
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 0 16px;
}
</style>
