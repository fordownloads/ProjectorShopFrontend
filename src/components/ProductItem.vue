<script setup>
import { RouterLink } from "vue-router";
import { defineProps, defineEmits } from "vue";
import { CONFIG } from "../config.ts";
import { speciesFix } from "../utils.ts";

const props = defineProps(["product", "inCart", "showGotoCart", "login"]);
const emit = defineEmits(["update"])

const cartAction = (type = 'add') => {
  fetch(`${CONFIG.apiUrl}/cart/${type}/${props.product.id}`, {method:'POST'})
        .then((x) => {
            if (x.status === 200) emit("update")
        })
};
</script>

<template>
  <div class="item">
    <RouterLink :to="`/products/${product.id}`">
      <div class="img">
        <img loading="lazy" :src="CONFIG.apiUrl + '/products/image/' + product.id" />
      </div>
      <h3 :class="{ standalone: false }">{{ (product.brand?.name ?? "") + " " + product.name }}</h3>
      <span class="price">{{ product.priceKopeck / 100 }} ₽</span>
      <span class="brand">
        {{ speciesFix(product.species) }}, {{ product.wet ? "Мокрый" : "Сухой" }}, {{ product.weightG / 1000 }} кг.
      </span>
    </RouterLink>
    <div v-if="inCart" class="combo">
      <RouterLink :to="`/cart`" v-if="showGotoCart" class="action-button cart-button secondary in-cart">Перейти в корзину</RouterLink>
      <button class="action-button cart-button" @click="e => cartAction('remove')"><img src="@/assets/del.svg"></button>
    </div>
    <button v-else-if="login" class="action-button cart-button combo" @click="e => cartAction()"><img src="@/assets/cart-btn.svg">Добавить в корзину</button>
  </div>
</template>

<style scoped>

.combo {
  margin: 0 16px 16px;
  gap:4px
}
.price {
  margin: 6px 18px;
    font-size: 1.25rem;
}
.item {
  display: flex;
  flex-direction: column;
  border-radius: 32px;
  background: #ffffff;
  padding: 0;
  color: rgb(0, 0, 0);
  box-shadow: 0 4px 16px 0 var(--shadow);
  text-decoration: none;
  overflow: hidden;
}

h3 {
  margin: 16px 18px 0;
  font-weight: 600;
  font-size: 1.25rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

a {
  color: #000;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}

.img {
  background-size: contain;
}

.img img {
  margin-bottom: -4px;
  width: 100%;
  object-fit: contain;
  height: 250px;
  backdrop-filter: blur(8px);
}

.brand {
  margin: 0 18px 16px;
  opacity: 0.75;
  text-transform: uppercase;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.standalone {
  margin-bottom: 16px
}
</style>
