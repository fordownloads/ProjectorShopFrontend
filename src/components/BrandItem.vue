<script setup>
import { RouterLink } from "vue-router";
import { defineProps } from "vue";
import { CONFIG } from "../config.ts";
defineProps(["brand", "justText"]);
</script>

<template>
  <RouterLink :to="`/brands/${brand.id}`" :class="{ justText }">
    <img loading="lazy" :src="CONFIG.apiUrl + '/brands/image/' + brand.id" />
    <div>
      <h3>{{ brand.name }}</h3>
      <div v-if="brand.year">
        <small>Год основания: </small> <span>{{ brand.year }}</span>
      </div>
      <div v-if="brand.phone">
        <small>Телефон: </small> <span>{{ brand.phone }}</span>
      </div>
      <div v-if="brand.email">
        <small>Email: </small> <span>{{ brand.email }}</span>
      </div>
      <div v-if="brand.website">
        <small>Сайт: </small> <span>{{ brand.website }}</span>
      </div>
      <div v-if="brand.country">
        <small>Страна: </small> <span>{{ brand.country }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
a {
  display: flex;
  gap: 32px;
  color: #000;
  text-decoration: none;
  flex-shrink: 0;
}
a.justText {
  cursor: text;
  pointer-events: none;
}
a:not(.justText) {
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 3px 8px rgb(240,240,240);
  cursor: pointer;
  width: 100%;
}
.justText > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
img {  width: 96px;  height: 32px; }
small {
  opacity: 0.75;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding-right: 8px;
  line-height: 2;
}
h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.25rem;
}
</style>
