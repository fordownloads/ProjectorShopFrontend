<script setup>
import { CONFIG } from "../config.ts";
import { onMounted, ref, computed, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ManagementTabs from '../components/ManagementTabs.vue'

const brands = ref(null);
const error = ref(null);

const page = computed(() => useRoute().query.page ?? 1);

const update = (offs) => {
  brands.value = null;
  error.value = null;
  fetch(`${CONFIG.apiUrl}/brands/details?page=${offs}`)
    .then((x) => x.json())
    .then((x) => {
      document.title = CONFIG.appName;
      if (x.length === 0) {
        error.value = "Ничего нет";
      } else {
        brands.value = x;
      }
    })
    .catch((x) => (error.value = x));
};

const deleteBrand = (id) => {
  fetch(`${CONFIG.apiUrl}/brands/delete/${id}`, { method: 'POST' })
    .then((x) => {
      if (x.status === 500)
        alert("Удалите товары перед удалением производителя")
      else
        update(page)
    })
    .catch((x) => (brandError.value = x));
};

onMounted(() => update(page.value));
watch(useRoute(), (x, y) => { if(y.path == "/management/brands") update(y.query.page ?? 1, y.query.species ?? "null") });
</script>

<template>
  <div class="split">
    <section v-if="brands?.length == 0">
      <h1>Здесь пусто</h1>
    </section>
    <section v-if="brands">
      <ManagementTabs />
      <div class="button-block">
        <RouterLink
          class="action-button"
          to="/brands/create">
          <img src="@/assets/add.svg">Создать...
        </RouterLink>
        <RouterLink
          class="action-button"
          v-if="page > 1"
          :to="{ path: '/management/brands', query: { page: +page - 1 } }">
          Назад
        </RouterLink>
        <RouterLink
          class="action-button"
          v-if="(brands.length == 30)"
          :to="{ path: '/management/brands', query: { page: +page + 1 } }">
          Вперед
        </RouterLink>
      </div>
      <table>
        <tr>
          <th>Название</th>
          <th>Страна</th>
          <th>Сайт</th>
          <th>Телефон</th>
          <th>Email</th>
          <th></th>
        </tr>
        <tr v-for="brand in brands" :key="brand" @click="">
          <td>{{ brand.name }}</td>
          <td>{{ brand.country }}</td>
          <td>{{ brand.website }}</td>
          <td>{{ brand.phone }}</td>
          <td>{{ brand.email }}</td>

          <td class="actions">
            <div>
              <RouterLink :to="{ path: `/brands/${brand.id}` }"><img src="@/assets/open.svg"></RouterLink>&nbsp;
              <RouterLink :to="{ path: `/brands/${brand.id}`, query: { edit: true } }"><img src="@/assets/edit.svg"></RouterLink>&nbsp;
              <a @click="deleteBrand(brand.id)"><img src="@/assets/del-black.svg"></a>
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

small {
  font-weight: 400;
  color: #666;
  padding: 8px;
}
</style>
