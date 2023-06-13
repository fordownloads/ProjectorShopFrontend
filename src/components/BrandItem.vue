<script setup>
import { RouterLink } from "vue-router";
import { defineProps } from "vue";
import { CONFIG } from "../config.ts";
import SpecsList from "../components/SpecsList.vue";
defineProps(["brand", "justText"]);
</script>

<template>
  <RouterLink :to="`/brands/${brand.id}`" :class="{ justText }">
    <img loading="lazy" :src="CONFIG.apiUrl + '/brands/image/' + brand.id" />
    <div>
      <h3>{{ brand.name }}</h3>
      <SpecsList v-if="brand.year" title="Год основания">{{ brand.year }}</SpecsList>
      <SpecsList v-if="brand.phone" title="Телефон">{{ brand.phone }}</SpecsList>
      <SpecsList v-if="brand.email" title="Email">{{ brand.email }}</SpecsList>
      <SpecsList v-if="brand.website" title="Сайт">{{ brand.website }}</SpecsList>
      <SpecsList v-if="brand.country" title="Страна">{{ brand.country }}</SpecsList>
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
h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.25rem;
}
</style>
