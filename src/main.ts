import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "@/style.css";
import App from "@/App.vue";
import Home from "@/explorer/Home.vue";
import Transaction from "./explorer/Transaction.vue";
import Block from "./explorer/Block.vue";
import Contract from "./explorer/Contract.vue";

const routes = [
    { path: "/", component: Home, name: "Home" },
    {
        path: "/tx/:tx_hash",
        component: Transaction,
        name: "Transaction",
    },
    {
        path: "/block/:block_hash",
        component: Block,
        name: "Block",
    },
    {
        path: "/contract/:contract_name",
        component: Contract,
        name: "Contract",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount("#app");
