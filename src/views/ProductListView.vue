<script setup>
import { CONFIG } from "../config.ts";
import { onMounted, ref, computed, watch, inject } from "vue";
import ProductItem from "../components/ProductItem.vue";
import { RouterLink, useRoute } from "vue-router";

const cart = ref(null);
const products = ref(null);
const error = ref(null);
const showFilters = ref(false);
const currentSpecies = ref("null");
const auth = inject("auth")
const speciesList = [
  ["null", "Все", "#777", "#666", null],
  ["Кот", "Для кошек<br>и котов", "#221122", "#442244", "/kit.png"],
  ["Собака", "Для<br>собак", "#ab4c19", "#ff9b93", "/ps.png"],
  ["Хомяк", "Для<br>грызунов", "#6e33d5", "#1fc9d1", "/hampter.png"]
]

const page = computed(() => useRoute().query.page ?? 1);

const update = (offs, species) => {
  //const saveScroll = document.documentElement.scrollTop
  showFilters.value = false
  //products.value = null;
  error.value = null;
  currentSpecies.value = species ?? "null";
  fetch(`${CONFIG.apiUrl}/products?page=${offs}&limit=30&species=${species}&idList=null`)
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
              
              //setTimeout(() => document.documentElement.scrollTop = saveScroll, 10)
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

onMounted(() => update(page.value, currentSpecies.value));
watch(useRoute(), (x, y) => { if(y.path == "/") update(y.query.page ?? 1, y.query.species ?? "null") });
</script>

<template>
  <div class="split">
    <section class="filters" :class="{ show: showFilters }">
      <h1>Фильтры</h1>
      <RouterLink
          v-for="s in speciesList" :key="s[0]"
          :style="`--col1: ${s[2]}; --col2: ${s[3]}`"
          :class="{ sel: currentSpecies == s[0], 'action-button':true }"
          :to="{ path: '/', query: { species: s[0] } }">
          <span v-html="s[1]"></span><img v-if="s[4]" :src="s[4]">
      </RouterLink>
    </section>
    <section v-if="products?.length == 0">
      <h1>Здесь пусто</h1>
    </section>
    <section v-if="showFilters"></section>
    <section v-else-if="products">
      <RouterLink to="/about">
        <img v-if="currentSpecies == 'null'" src="/banner.jpg" alt="" class="banner">
      </RouterLink>
      <h1>
        Корм <small>страница {{ page }}</small>
      </h1>
      <div class="button-block">
        <RouterLink
          class="action-button"
          v-if="page > 1"
          :to="{ path: '/', query: { page: +page - 1, species: currentSpecies } }">
          Назад
        </RouterLink>
        <RouterLink
          class="action-button"
          v-if="(products.length == 30)"
          :to="{ path: '/', query: { page: +page + 1, species: currentSpecies } }">
          Вперед
        </RouterLink>
        <button class="action-button desktop-hide secondary" @click="showFilters=!showFilters">Фильтры</button>
      </div>
      <div class="grid">
        <ProductItem
          @update="e => update(page, currentSpecies)"
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

<style>
body {
overflow-y: scroll;
}
</style>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filters a:hover img, .filters a.sel  img{
  transform: scale(1.15) translateX(-3px);
}
.filters img {
  width: 72px;
  margin: -33px -25px -16px auto;
  border-radius: 0 0 26px 0;
    transform-origin: bottom;
    transition: .2s ease;
}
.filters a.sel, .filters a:hover {
  box-shadow: 0 0 0 2px var(--col1);
}

.filters a:hover {
  transform: scale(.95);
}
.filters a:active {
  transform: scale(.9) 
}
.filters a {
  text-decoration: none;
  border-radius: 100px;
    padding: 12px 28px;
  border: 2px solid;
    background: #777;
    font-size: 1rem;
    font-weight: 500;
    width: 200px;
    color: #fff;
    text-align: left;
    display: flex;
    align-items: center;
    transition: .2s ease;
    background: linear-gradient(-45deg, var(--col1), var(--col2))
}

.banner {
  width: 100%;
    border-radius: 48px;
  box-shadow: 0 4px 16px 0 var(--shadow);
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
.split{
  flex-direction: column;
}
.filters { display: none; width: 100%;}
.filters a {  width: 100%;}
.filters.show { display: flex;}
.grid {
  grid-template-columns: repeat(1, 1fr);
}
}
</style>
