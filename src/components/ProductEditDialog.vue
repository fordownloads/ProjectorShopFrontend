<script setup>
import { CONFIG } from "../config.ts";
import Input from "./Input.vue";
import { watch, ref, defineProps, defineEmits } from "vue";

const props = defineProps(["product", "show"]);
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
    fetch(`${CONFIG.apiUrl}/products/EditPhoto/${props.product.id}`, {method: "POST", body: formData})
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
  console.log(JSON.stringify(props.product))
  error.value = null;
  fetch(`${CONFIG.apiUrl}/products/edit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(props.product),
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

watch(props, (x, y) => { if (y.show) getBrands() });
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div class="backdrop" v-if="show" @click.self="$emit('closeModal')" />
    </Transition>
    <div class="modalWrap">
      <Transition>
        <div class="modal" v-if="show">
          <h1>Изменить товар</h1>
          <span v-if="error">{{ error }}</span>
          <Input type="text" placeholder="Название" v-model="product.name" />
          <Input type="text" placeholder="Цена (в коп.)" v-model="product.priceKopeck" />
          <Input type="checkbox" placeholder="В наличии" v-model="product.available" />
          <Input type="text" placeholder="Вес (г.)" v-model="product.weightG" />
          <Input type="checkbox" placeholder="Мокрый корм" v-model="product.wet" />
          <Input type="text" placeholder="Назначение корма" v-model="product.spec" />
          <Input type="text" placeholder="Вкус" v-model="product.taste" />
          <Input type="textarea" placeholder="Описание" v-model="product.description"></Input>
          <Input type="select" placeholder="Выберите животное" v-model="product.species">
            <option v-for="s in CONFIG.animalList" :key="s" :value="s">{{ s }}</option>
          </Input>
          <Input type="select" placeholder="Выберите производителя" v-model="product.brandId">
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
          </Input>
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
    overflow: scroll;
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
  align-items: baseline;
  padding: 16px;
  z-index: 12;
  perspective: 1000px;
  overflow-y: auto;
}

.modal {
  background: var(--dark-1);
  width: 600px;
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

button {
  margin-top: 16px;
}

h1 {
  margin :0
}
</style>
