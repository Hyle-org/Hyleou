import { reactive, ref, watchEffect } from "vue";
import { BlockStore } from "@/state/blocks";
import { network } from "@/state/network";
import { TransactionStore } from "./transactions";
import { ContractStore } from "./contracts";

export const blockStore = ref(reactive(new BlockStore(network.value)));
export const transactionStore = ref(reactive(new TransactionStore(network.value)));
export const contractStore = ref(reactive(new ContractStore(network.value)));

watchEffect(() => {
    blockStore.value = reactive(new BlockStore(network.value));
    transactionStore.value = reactive(new TransactionStore(network.value));
    contractStore.value = reactive(new ContractStore(network.value));

    blockStore.value.loadLatest();
    transactionStore.value.loadLatest();
    contractStore.value.loadAll();
});
