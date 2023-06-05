<script setup>
import { CONFIG } from "../config.ts";
import Input from "../components/Input.vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

const product = ref({ brandId: "", available: true, wet: true });
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
    fetch(`${CONFIG.apiUrl}/products/EditPhoto/${id}`, {method: "POST", body: formData})
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

      <Input type="text" placeholder="Название" v-model="product.name" />
      <Input type="text" placeholder="Цена (в коп.)" v-model="product.priceKopeck" />
      <Input type="checkbox" placeholder="В наличии" v-model="product.available" />
      <Input type="text" placeholder="Вес (г.)" v-model="product.weightG" />
      <Input type="checkbox" placeholder="Мокрый корм" v-model="product.wet" />
      <Input type="text" placeholder="Разрешение" v-model="product.spec" />
      <Input type="text" placeholder="Вкус" v-model="product.taste" />
      <Input type="textarea" placeholder="Описание" v-model="product.description"/>
      <Input type="select" placeholder="Выберите животное" v-model="product.species">
        <option v-for="s in CONFIG.animalList" :key="s" :value="s">{{ s }}</option>
      </Input>
      <Input type="select" placeholder="Выберите производителя" v-model="product.brandId">
        <option v-for="brand in brands" :key="brand" :value="brand.id">
          {{ brand.name }}
        </option>
      </Input>
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
::placeholder {
  color: #aaa;
}

button {
  border-radius: 6px;
  margin-top: 16px;
}
</style>
