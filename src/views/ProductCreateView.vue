<script setup>
import { CONFIG } from "../config.ts";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

const product = ref({ brandId: "" });
const error = ref(null);
const fileInput = ref(null)

const brands = ref([]);
const router = useRouter()
let filesCache = null

const getBrands = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/brands`)
    .then((x) => x.json())
    .then((x) => (brands.value = x))
    .catch((err) => (error.value = err));
};

const create = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/products/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product.value),
  }).then((x) => x.json())
    .then((x) => {
        uploadFile(x.id)
    })
    .catch((x) => (error.value = x));
};

const uploadFile = (id) => {
    if (filesCache == fileInput.value.files[0])
        return

    filesCache = fileInput.value.files[0]
    const formData = new FormData();
    formData.append('uploadedFile', fileInput.value.files[0]);
    fetch(`${CONFIG.apiUrl}/products/EditPhoto/${id}/0`, {method: "POST", body: formData})
        .then(x => {
          if (x.status === 200)
              router.push('/products/' + id);
          else error.value = x.statusText
        })
        .catch((x) => (error.value = x));
}

onMounted(getBrands);
</script>

<template>
  <div class="wrap">
    <div class="form">
      <h1>Добавить товар</h1>
      <input type="text" placeholder="Название" v-model="product.model" />
      <input type="text" placeholder="Разрешение" v-model="product.resolution" />
      <input type="text" placeholder="Цвет" v-model="product.color" />
      <select v-model="product.brandId">
        <option disabled selected value="">Выберите производителя</option>
        <option v-for="brand in brands" :key="brand" :value="brand.id">
          {{ brand.name }}
        </option>
      </select>
      <input type="file" ref="fileInput" />
      <span v-if="error">{{ error }}</span>
      <button class="action-button" @click="create">Добавить</button>
    </div>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  gap: 8px;
}
.wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
input,
select {
  background: var(--dark-2);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--dark-3);
  color: #000;
}
::placeholder {
  color: #aaa;
}

button {
  border-radius: 6px;
  margin-top: 16px;
}
</style>
