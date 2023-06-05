<script setup>
import { CONFIG } from "../config.ts";
import { onMounted, ref, defineProps, defineEmits } from "vue";
import Input from "./Input.vue";

const props = defineProps(["brand", "show"]);
const emit = defineEmits(["closeModal"]);

const error = ref(null);
const fileInput = ref(null);
let filesCache = null;
const uploadImg = () => {
    if (filesCache == fileInput.value.files[0])
        return create()

    filesCache = fileInput.value.files[0]
    const formData = new FormData();
    formData.append('uploadedFile', fileInput.value.files[0]);
    fetch(`${CONFIG.apiUrl}/brands/EditLogo/${props.brand.id}`, {method: "POST", body: formData})
    .then((x) => {
      if (x.status === 200)
        emit('closeModal')
      else
        error.value = x.statusText
    })
        .catch((x) => (error.value = x));
}

const update = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/brands/edit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(props.brand),
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
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div class="backdrop" v-if="show" @click.self="$emit('closeModal')" />
    </Transition>
    <div class="modalWrap">
      <Transition>
        <div class="modal" v-if="show">
          <h1>Изменить производителя</h1>
          <Input type="text" placeholder="Название" v-model="brand.name" />
          <Input type="text" placeholder="Страна" v-model="brand.country" />
          <Input type="text" placeholder="Сайт" v-model="brand.website" />
          <Input type="text" placeholder="Телефон" v-model="brand.phone" />
          <Input type="text" placeholder="Почта" v-model="brand.email" />
          <Input type="text" placeholder="Описание" v-model="brand.description" />
          <Input type="number" placeholder="Год основания" v-model="brand.year" />
          <span v-if="error">{{ error }}</span>
          <button class="action-button" @click="update">Изменить</button>
          <h2 class="mobile-hide">Логотип</h2>
          <input class="mobile-hide" type="file" ref="fileInput" />
          <button class="mobile-hide action-button" @click="uploadImg">Обновить логотип</button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
@media (max-width: 800px) {
  .modal {
    margin-inline: 16px;
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
  z-index: 11;
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
  z-index: 12;
}
.modalWrap {
  perspective: 1000px;
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
