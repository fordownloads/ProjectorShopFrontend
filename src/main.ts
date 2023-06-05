import { createRouter, createWebHistory } from "vue-router";
import { createApp } from "vue";
import App from "./App.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    
    routes: [
        {
            path: "/",
            name: "Главная",
            meta: { icon: "M220 876h150V626h220v250h150V486L480 291 220 486v390Zm-60 60V456l320-240 320 240v480H530V686H430v250H160Zm320-353Z" },
            component: () => import("./views/ProductListView.vue"),
        },
        {
            path: "/brands",
            name: "Производители",
            meta: { icon: "M160 316v-60h642v60H160Zm5 580V638h-49v-60l44-202h641l44 202v60h-49v258h-60V638H547v258H165Zm60-60h262V638H225v198Zm-50-258h611-611Zm0 0h611l-31-142H206l-31 142Z" },
            component: () => import("./views/BrandListView.vue")
        },
        {
            path: "/cart",
            name: "Корзина",
            meta: { icon: "M286.788 975Q257 975 236 953.788q-21-21.213-21-51Q215 873 236.212 852q21.213-21 51-21Q317 831 338 852.212q21 21.213 21 51Q359 933 337.788 954q-21.213 21-51 21Zm400 0Q657 975 636 953.788q-21-21.213-21-51Q615 873 636.212 852q21.213-21 51-21Q717 831 738 852.212q21 21.213 21 51Q759 933 737.788 954q-21.213 21-51 21ZM235 315l110 228h288l125-228H235Zm-30-60h589.074q22.964 0 34.945 21Q841 297 829 318L694 561q-11 19-28.559 30.5Q647.881 603 627 603H324l-56 104h491v60H277q-42 0-60.5-28t.5-63l64-118-152-322H51v-60h117l37 79Zm140 288h288-288Z" },
            component: () => import("./views/CartView.vue"),
        },
        {
            path: "/about",
            name: "О нас",
            meta: { hideMobile: true, back: true },
            component: () => import("./views/AboutView.vue"),
        },
        {
            path: "/contact",
            name: "Контакты",
            meta: { hideMobile: true, back: true },
            component: () => import("./views/ContactView.vue"),
        },
        {
            path: "/products/:id",
            name: "Товар",
            meta: { hide: true, back: true },
            component: () => import("./views/ProductView.vue")
        },
        {
            path: "/brands/:id",
            name: "Производитель",
            meta: { hide: true, back: true },
            component: () => import("./views/BrandView.vue"),
        },
        {
            path: "/brands/create",
            name: "Добавить производителя",
            meta: { hide: true, back: true },
            component: () => import("./views/BrandCreateView.vue"),
        },
        {
            path: "/products/create",
            name: "Добавить товар",
            meta: { hide: true, back: true },
            component: () => import("./views/ProductCreateView.vue"),
        },
        {
            path: "/management",
            name: "Управление",
            meta: { admin: true, hideMobile: true },
            redirect: "/management/products"
        },
        {
            path: "/management/products",
            name: "Товары",
            meta: { admin: true, hide: true, back: true },
            component: () => import("./views/ProductTableView.vue"),
        },
        {
            path: "/management/brands",
            name: "Производители",
            meta: { admin: true, hide: true, back: true },
            component: () => import("./views/BrandTableView.vue"),
        },
        {
            path: "/login",
            name: "Вход",
            meta: { hideDesktop: true, loggedIn: false, icon: "M222 801q63-44 125-67.5T480 710q71 0 133.5 23.5T739 801q44-54 62.5-109T820 576q0-145-97.5-242.5T480 236q-145 0-242.5 97.5T140 576q0 61 19 116t63 109Zm257.814-195Q422 606 382.5 566.314q-39.5-39.686-39.5-97.5t39.686-97.314q39.686-39.5 97.5-39.5t97.314 39.686q39.5 39.686 39.5 97.5T577.314 566.5q-39.686 39.5-97.5 39.5Zm.654 370Q398 976 325 944.5q-73-31.5-127.5-86t-86-127.266Q80 658.468 80 575.734T111.5 420.5q31.5-72.5 86-127t127.266-86q72.766-31.5 155.5-31.5T635.5 207.5q72.5 31.5 127 86t86 127.032q31.5 72.532 31.5 155T848.5 731q-31.5 73-86 127.5t-127.032 86q-72.532 31.5-155 31.5ZM480 916q55 0 107.5-16T691 844q-51-36-104-55t-107-19q-54 0-107 19t-104 55q51 40 103.5 56T480 916Zm0-370q34 0 55.5-21.5T557 469q0-34-21.5-55.5T480 392q-34 0-55.5 21.5T403 469q0 34 21.5 55.5T480 546Zm0-77Zm0 374Z" },
            component: () => import("./views/LoginView.vue"),
        },
        {
            path: "/register",
            name: "Регистрация",
            meta: { hide: true, back: true },
            component: () => import("./views/RegisterView.vue"),
        },
        {
            path: "/account",
            name: "Аккаунт",
            meta: { hideDesktop: true, loggedIn: true, icon: "M222 801q63-44 125-67.5T480 710q71 0 133.5 23.5T739 801q44-54 62.5-109T820 576q0-145-97.5-242.5T480 236q-145 0-242.5 97.5T140 576q0 61 19 116t63 109Zm257.814-195Q422 606 382.5 566.314q-39.5-39.686-39.5-97.5t39.686-97.314q39.686-39.5 97.5-39.5t97.314 39.686q39.5 39.686 39.5 97.5T577.314 566.5q-39.686 39.5-97.5 39.5Zm.654 370Q398 976 325 944.5q-73-31.5-127.5-86t-86-127.266Q80 658.468 80 575.734T111.5 420.5q31.5-72.5 86-127t127.266-86q72.766-31.5 155.5-31.5T635.5 207.5q72.5 31.5 127 86t86 127.032q31.5 72.532 31.5 155T848.5 731q-31.5 73-86 127.5t-127.032 86q-72.532 31.5-155 31.5ZM480 916q55 0 107.5-16T691 844q-51-36-104-55t-107-19q-54 0-107 19t-104 55q51 40 103.5 56T480 916Zm0-370q34 0 55.5-21.5T557 469q0-34-21.5-55.5T480 392q-34 0-55.5 21.5T403 469q0 34 21.5 55.5T480 546Zm0-77Zm0 374Z" },
            component: () => import("./views/AccountView.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            meta: { hide:true },
            redirect: "/"
        }
    ],
});

const app = createApp(App);

app.use(router);

app.mount("#app");