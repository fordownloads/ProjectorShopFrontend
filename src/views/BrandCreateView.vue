<script setup>
import { CONFIG } from "../config.ts";
import { useRouter } from "vue-router";
import { ref } from "vue";

const brand = ref({});
const error = ref(null);
const router = useRouter();
const fileInput = ref(null);
let filesCache = null;

const create = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/brands/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brand.value),
  }).then((x) => x.json())
    .then((x) => {
      uploadFile(x.id)
    })
    .catch((x) => (error.value = x));
};

const uploadFile = (id) => {
    if (filesCache == fileInput.value.files[0])
        return create()

    filesCache = fileInput.value.files[0]
    const formData = new FormData();
    formData.append('uploadedFile', fileInput.value.files[0]);
    fetch(`${CONFIG.apiUrl}/brands/EditLogo/${id}`, {method: "POST", body: formData})
        .then((x) => {
          if (x.status !== 200)
          error.value = x.statusText
          else
            router.push('/brands/' + id);
        })
        .catch((x) => (error.value = x));
}
</script>

<template>
  <div class="wrap">
    <div class="form">
      <h1>Добавить производителя</h1>
      <input type="text" placeholder="Название" v-model="brand.name" />
      <input type="text" placeholder="Страна" v-model="brand.country" />
      <input type="text" placeholder="Сайт" v-model="brand.website" />
      <input type="text" placeholder="Телефон" v-model="brand.phone" />
      <input type="text" placeholder="Почта" v-model="brand.email" />
      <input type="text" placeholder="Описание" v-model="brand.description" />
      <input type="text" placeholder="Год основания" v-model="brand.year" />
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
input, select {
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
