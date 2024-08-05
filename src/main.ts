import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "@/style.css";
import App from "@/App.vue";
import Home from "@/explorer/Home.vue";
import ContractView from "@/explorer/ContractView.vue";
import BlockView from "@/explorer/BlockView.vue";
import TransactionView from "@/explorer/TransactionView.vue";
import RegisterContract from "@/explorer/RegisterContract.vue";

const routes = [
    { path: "/", component: Home, name: "Home" },
    {
        path: "/contract/:contract_name",
        component: ContractView,
        name: "contract",
    },
    { path: "/block/:block_id", component: BlockView, name: "block" },
    {
        path: "/transaction/:tx_hash",
        component: TransactionView,
        name: "transaction",
    },
    {
        path: "/register_contract",
        component: RegisterContract,
        name: "register_contract",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount("#app");
