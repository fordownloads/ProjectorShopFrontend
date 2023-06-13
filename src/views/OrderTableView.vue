<script setup>
import { CONFIG } from "../config.ts";
import { onMounted, ref, computed, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ManagementTabs from '../components/ManagementTabs.vue'
import SpecsList from "../components/SpecsList.vue";

const orders = ref(null);
const error = ref(null);

const page = computed(() => useRoute().query.page ?? 1);

const update = (offs) => {
  currentOrder.value = null;
  orders.value = null;
  error.value = null;
  fetch(`${CONFIG.apiUrl}/order?page=${offs}`)
    .then((x) => x.json())
    .then((x) => {
      document.title = CONFIG.appName;
      if (x.length === 0) {
        orders.value = [];
      } else {
        orders.value = x;
      }
    })
    .catch((x) => (error.value = x));
};

const currentOrder = ref(null)

const getProducts = (order) => {
    fetch(`${CONFIG.apiUrl}/products?page=1&limit=1000&species=null&idList=${order.products.join()}`)
      .then((y) => y.json())
      .then((products) => { currentOrder.value = { ...order, products } })
};

const setComplete = (order) => {
    fetch(`${CONFIG.apiUrl}/Order/SetStatus/${currentOrder.value.id}?finished=true`)
      .then((y) => y.text())
      .then((y) => { alert('Готово'); update(page.value) })
};

const exportJSON = () => {
    const a = document.createElement('a')
    a.download = currentOrder.value.id + '.json'
    a.href = URL.createObjectURL(new Blob([JSON.stringify(currentOrder.value)], { type: 'application/json' }))
    a.click()
    a.remove()
};

onMounted(() => update(page.value));
watch(useRoute(), (x, y) => { if(y.path == "/management/orders") update(y.query.page ?? 1, y.query.species ?? "null") });
</script>

<template>
  <div class="split">
    <section v-if="orders">
      <ManagementTabs />
      <div class="button-block">
        <a class="action-button" download="orders.json" href="/api/order?page=0">
          Экспорт в JSON
        </a>
        <RouterLink
          class="action-button"
          v-if="page > 1"
          :to="{ path: '/management/orders', query: { page: +page - 1 } }">
          Назад
        </RouterLink>
        <RouterLink
          class="action-button"
          v-if="(orders.length == 30)"
          :to="{ path: '/management/orders', query: { page: +page + 1 } }">
          Вперед
        </RouterLink>
      </div>
      <div class="tables">
        <table class="orders">
          <tr>
            <th>ФИО</th>
            <th>Адрес</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Количество товаров</th>
            <th></th>
          </tr>
          <tr v-for="order in orders" :key="order.id" @click="">
            <td>{{ order.lastname + ' ' + order.firstname + ' ' + order.middlename }}</td>
            <td>{{ order.address }}</td>
            <td>{{ order.phone }}</td>
            <td>{{ order.email }}</td>
            <td>{{ order.count }}</td>

            <td class="actions">
              <div>
                <a @click="() => getProducts(order)"><img src="@/assets/open.svg"></a>
              </div>
            </td>
          </tr>
        </table>
        <div class="orderCard" v-if="currentOrder">
          <h2>Детали заказа</h2>
          <table >
            <tr>
              <th>Название</th>
              <th>Цена (руб.)</th>
              <th>Вес (грамм)</th>
              <th></th>
            </tr>
            <tr v-for="product in currentOrder.products" :key="product" @click="">
              <td>{{ product.brand.name + " " + product.name }}</td>
              <td>{{ product.available ? product.priceKopeck /100 : 'Нет в наличии' }}</td>
              <td>{{ product.weightG }}</td>
              <td class="actions">
                <div>
                  <RouterLink :to="{ path: `/products/${product.id}` }"><img src="@/assets/open.svg"></RouterLink>&nbsp;
                </div>
              </td>
            </tr>
          </table>
          <h2>Покупатель</h2>
          
          <SpecsList title="ФИО">{{ currentOrder.lastname + ' ' + currentOrder.firstname + ' ' + currentOrder.middlename }}</SpecsList>
          <SpecsList title="Адрес">{{ currentOrder.address }}</SpecsList>
          <SpecsList title="Тел.">{{ currentOrder.phone }}</SpecsList>
          <SpecsList title="Email">{{ currentOrder.email }}</SpecsList><br>
          <div class="button-block">
            <button class="action-button" @click="setComplete">Выполнено</button>
            <button class="action-button secondary" @click="exportJSON">Скачать JSON</button>
          </div>
        </div>
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
.orderCard .button-block { margin: 0 }

.orderCard .action-button.secondary {
  border-color: #ffffff
}
.tables {
  display: flex;
  gap: 16px;
}
.orderCard {
  
  width: 35%;
}
.orderCard {
    margin-bottom: auto;
  border-radius: 32px;
  padding: 8px 30px 28px 30px;
  background: var(--dark-3);
  box-shadow: 0 4px 16px 0 var(--shadow);
}

.orderCard th {
text-align: left;
}
.orderCard td {
  border-top: 1px solid #ddd;
}

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
.orders {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: auto;
}

.orders td, .orders th {
  border: 1px solid #ddd;
  padding: 8px;
}

.orders tr:nth-child(even){background-color: #f2f2f2;}

.orders tr:hover {background-color: #ddd;}

.orders th {
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
