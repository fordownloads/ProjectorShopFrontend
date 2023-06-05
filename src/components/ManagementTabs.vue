<script setup>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { onMounted, ref, computed, watch } from "vue";

const routes = computed(() =>
  useRouter()
    .getRoutes()
    .filter((r) => r?.path?.startsWith('/management/'))
);

const currentRoute = computed(() => useRoute().path);
const currentPage = computed(() => useRoute().query.page);
</script>

<template>
<div>
    <h1 v-for="route of routes">
      <RouterLink
        :to="route.path"
        :class="{ active: currentRoute == route.path }"
        :key="route.path">
        {{ route.name }}
      </RouterLink>
    <small :class="{ hide: currentRoute != route.path }">страница {{ currentPage ?? 1 }}</small>
    </h1>
  </div>
</template>

<style scoped>
div {
    display: flex;
    gap: 16px;
}
a {
    text-decoration: none;
    font-weight: 400;
    opacity: 0.9;
    border-bottom: 2px dotted #0002;
    padding-bottom: 4px;
}
.active {
    border-bottom: 2px solid #000;
    font-weight: 600;
    opacity: 1;
}

small {
  font-weight: 400;
  color: #666;
  padding: 8px;
}
</style>