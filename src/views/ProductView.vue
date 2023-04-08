<script setup>
import { CONFIG } from "../config.ts";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, inject, watch } from "vue";
import { computed } from "vue";
import BrandItem from "../components/BrandItem.vue";
import ProductEditDialog from "../components/ProductEditDialog.vue";

const auth = inject("auth")
const inCart = ref(false);
const product = ref(null);
const error = ref(null);
const open = ref(false);
const id = computed(() => useRoute().params.id);
const router = useRouter();

const getCart = () =>
    fetch(`${CONFIG.apiUrl}/cart`)
        .then(x => x.json())

const update = () => {
  if (window.Android)
    window.Android.changeStatusBarColor(true)
  product.value = null;
  error.value = null;
  fetch(`${CONFIG.apiUrl}/products/${id.value}`)
    .then((x) => x.json())
    .then((x) => {
        product.value = {...x, brandId: x.brand.id};
        document.title = `${x.model} — ${CONFIG.appName}`;

        if (auth.value.auth)
          getCart()
            .then(c => {
              const guids = c.map(y => y.productId)
              inCart.value = guids.indexOf(x.id) >= 0
            })
    })
    .catch((x) => (error.value = x));
};

const deleteProduct = () => {
  fetch(`${CONFIG.apiUrl}/products/delete/${id.value}`, { method: 'POST' })
    .then((x) => {
      if (x.status === 200)
        router.push('/');
      else
        error.value = x.statusText
    })
    .catch((x) => (error.value = x));
};

const translate = key => ({
  LampType: "Тип лампы",
  ProjectionTechnology: "Технология проекции"
})[key] ?? key

onMounted(update);

const cartAction = (type = 'add') => {
  fetch(`${CONFIG.apiUrl}/cart/${type}/${id.value}`, {method:'POST'})
        .then((x) => {
            if (x.status === 200) update()
        })
};

watch(open, (n, o) => {
  if (window.Android)
    window.Android.changeStatusBarColor(!n)
})
</script>

<template>
  <div class="split">
    <section v-if="product">
      <div
        class="grid">
        <div class="img">
          <img loading="lazy" :src="CONFIG.apiUrl + '/products/image/' + product.id + '/0'"  class="product" />
        </div>
        <div class="info">
          <h2>{{ product.brand.name + ' ' + product.model }}</h2>
          <div>
            <small>Разрешение: </small><span>{{ product.resolution }}</span>
          </div>
          <div>
            <small>Цвет: </small><span>{{ product.color }}</span>
          </div>
          <div v-for="(v, k) in product.otherSpecs">
            <small>{{ translate(k) }}: </small><span>{{ v }}</span>
          </div>
          <div v-if="inCart" class="combo">
            <RouterLink :to="`/cart`" class="action-button cart-button in-cart">Перейти в корзину</RouterLink>
          </div>
          <button v-else-if="auth?.auth" class="action-button cart-button combo" @click="cartAction()"><img src="@/assets/cart-btn.svg">Добавить в корзину</button>
          <h2>Производитель</h2>
          <brand-item :brand="product.brand" />
          <div class="button-block" v-if="auth?.isAdmin">
            <button @click="open=true" class="action-button">Редактировать описание</button>
            <button @click="deleteProduct()" class="action-button">Удалить</button>
          </div>
        </div>
      </div>
    </section>
    <section v-else-if="error">
      <h1>Ошибка</h1>
      <span>{{ error }}</span><br /><br />
      <button class="action-button" @click="update()">Попробовать снова</button>
    </section>
    <section v-else class="loading">
      <img src="@/assets/logo-load.svg" width="72" height="72" />
    </section>
    <ProductEditDialog v-if="product" :open="open" :product="product" @closeModal="open=false;update()" />
  </div>
</template>

<style scoped>
section { width: 100%; }

.combo {
  margin: 16px 0 32px;
}

.img {
  height: 500px;
  background-repeat: no-repeat;
}

.grid {
  display: flex;
  gap: 32px;
}

.grid > .info {
  flex-grow: 1;
}

.split {
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 0 16px;
}

.product {
  height: 500px;
  object-fit: contain;
  backdrop-filter: blur(8px);
  width: 500px;
  margin-bottom: -4px;
}

small {
  opacity: 0.75;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding-right: 8px;
  line-height: 2;
}

h2:first-child {
  margin-top: 0;
}

@media (max-width: 800px) {
  
.img {
  width: 100% !important;
}
.product {
  width: 100% !important;
}
.grid {
  flex-direction: column;
}
}
</style>
