<script setup>
import { CONFIG } from "../config.ts";
import { onMounted, ref, defineProps, defineEmits } from "vue";

const props = defineProps(["product", "open"]);
const emit = defineEmits(["closeModal"]);

const error = ref(null);

const brands = ref([]);
const fileInput = ref(null);
let filesCache = null;

const uploadImg = () => {
    if (filesCache == fileInput.value.files[0])
        return create()

    filesCache = fileInput.value.files[0]
    const formData = new FormData();
    formData.append('uploadedFile', fileInput.value.files[0]);
    fetch(`${CONFIG.apiUrl}/products/EditPhoto/${props.product.id}/0`, {method: "POST", body: formData})
    .then((x) => {
      if (x.status === 200)
        emit('closeModal')
      else
        error.value = x.statusText
    })
        .catch((x) => (error.value = x));
}

const getBrands = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/brands`)
    .then((result) => {
      result.json().then((result) => {
        brands.value = result;
        brands.value.brandId = result.brand.id
      });
    })
    .catch((err) => (error.value = err));
};

const update = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/products/edit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...props.product, otherSpecs: null }),
    }
  )
    .then((x) => {
      if (x.status === 200)
        emit('closeModal')
      else
        error.value = x.statusText
    })
    .catch((x) => (error.value = x));
};

onMounted(getBrands);
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div class="backdrop" v-if="open" @click.self="$emit('closeModal')" />
    </Transition>
    <div class="modalWrap">
      <Transition>
        <div class="modal" v-if="open">
          <h1>Изменить товар</h1>
          <span v-if="error">{{ error }}</span>
          <h2>Описание</h2>
          <input type="text" placeholder="Название" v-model="product.model" />
          <input type="text" placeholder="Разрешение" v-model="product.resolution" />
          <input type="text" placeholder="Цвет" v-model="product.color" />
          <select v-model="product.brandId">
            <option disabled selected value="">Выберите производителя</option>
            <option v-for="brand in brands" :key="brand" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
          <button class="action-button" @click="update">Изменить</button>
          <h2 class="mobile-hide">Фото</h2>
          <input class="mobile-hide" type="file" ref="fileInput" />
          <button class="action-button mobile-hide" @click="uploadImg">Обновить фото</button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
@media (max-width: 800px) {
  .modal {
    margin: 16px !important;
  }
}
.modalWrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 12;
  perspective: 1000px;
}

.modal {
  background: var(--dark-1);
  width: 400px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  box-shadow: 0px 0px 2px #0004;
  padding: 32px;
  border-radius: 14px;
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0008;
  z-index: 11;
}
.modal {
  transform-origin: top;
  pointer-events: all;
  overflow: hidden;
}
.modalWrap {
  pointer-events: none;
}

input,
select {
  background: var(--dark-2);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--dark-3);
  color: #000;
}
button {
  border-radius: 6px;
  margin-top: 16px;
}

::placeholder {
  color: #aaa;
}

h1 {
  margin :0
}
</style>
