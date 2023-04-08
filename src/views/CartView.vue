<script setup>
import { inject, ref } from 'vue';
import { onMounted } from "vue";
import { CONFIG } from '../config.ts'
import ProductItem from "../components/ProductItem.vue";

const orderOpen = ref(false);
const user = ref(null);
const items = ref(null);
const auth = inject("auth")
let error = ref(null)

const getCart = () => {
    error.value = null;
    fetch(`${CONFIG.apiUrl}/cart`)
        .then((x) => x.json())
        .then(x => {
            if (x.length == 0) {
                items.value = []
                return
            }
            fetch(`${CONFIG.apiUrl}/products?page=1&idList=${x.map(x => x.productId).join()}`)
            .then((y) => y.json())
            .then((y) => { items.value = y })
        })
        .catch((x) => (error.value = x));
};


const getUser = () => {
  error.value = null;
  fetch(`${CONFIG.apiUrl}/users/me?info=true`, {method:'post'})
  .then(x => x.json())
    .then((x) => { user.value = x })
    .catch((x) => (error.value = x));
};

const order = () => {
    alert('Заказ принят')
  fetch(`${CONFIG.apiUrl}/cart/clear`, {method:'post'})
    .then((x) => getCart())
};

onMounted(() => { getCart(); getUser() })
</script>
<template>
    <div class="wrap">
        <div class="split">
            <div class="cart">
                <h1>Корзина</h1>
                <div v-if="auth.auth" class="grid">
                    <ProductItem v-if="items?.length > 0"
                        :show-goto-cart="false" :product="item" :in-cart="true"
                        v-for="item in items" :key="item.id"
                        @update="getCart" />
                    <span v-else>Корзина пуста. <RouterLink to="/">Добавьте</RouterLink> товары в корзину.</span>
                </div>
                <span v-else><RouterLink to="/login">Войдите</RouterLink>, чтобы добавлять товары в корзину</span>
                <div style="height: 88px"></div>
            </div>
            <div :class="{ order: true, orderOpen }" v-if="user && items?.length > 0" >
                <h2 @click="orderOpen = true" >Сделать заказ <svg :class="{ hide: orderOpen }" xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="48"><path d="m557 838-67-65 153-152H139v-94h504L489 373l67-64 266 265-265 264Z"></path></svg></h2>
                <span>Имя</span>
                <input readonly type="text" v-model="user.firstname" />
                <span>Фамилия</span>
                <input readonly type="text" v-model="user.lastname" />
                <span>Отчество</span>
                <input readonly type="text" v-model="user.middlename" />
                <span>Email</span>
                <input readonly type="text" v-model="user.email" />
                <span>Адрес</span>
                <input readonly type="text" v-model="user.address" />
                <span>Телефон</span>
                <input readonly type="text" v-model="user.phone" />
                <RouterLink to="/account">Изменить данные</RouterLink>
                <button class="action-button" @click="order">Сделать заказ</button>
                <button :class="{ hide: !orderOpen }" class="action-button" @click="orderOpen = false">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 800px) {
.split>.cart {
    width: 100% !important;
}
h2 { display: flex;}
.split>.order {
    width: calc(100% - 64px) !important;
    padding: 0 16px;
    position: fixed;
    height: 60px;
    border-radius: 16px;
    bottom: calc(var(--inset-top, 0) + 96px);
    left: 32px;
    right: 32px;
    background: var(--dark-1-trans);
    overflow: hidden;
    box-shadow: 0 4px 16px 0 #0002;
    backdrop-filter: blur(10px);
    transition: all .4s cubic-bezier(0.69, 0.02, 0.14, 1.03)
}
.order.orderOpen {
    padding: 0 32px;
    top: 0 !important;
    padding-top: calc(var(--inset-top, 0) + 72px) !important;
    left: 0 !important;
    right: 0 !important;
    height: 100% !important;
    width: 100% !important;
    background: var(--dark-1);
    transition: none
}
.grid {
  grid-template-columns: repeat(1, 1fr) !important;
}
}
.split>.cart {
    width: 75%;
}

.split>.order {
    width: 25%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.split {
    display: flex;
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
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

</style>
