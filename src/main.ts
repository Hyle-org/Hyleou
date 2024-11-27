import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "@/style.css";
import App from "@/App.vue";
import Home from "@/explorer/Home.vue";

const routes = [{ path: "/", component: Home, name: "Home" }];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount("#app");
