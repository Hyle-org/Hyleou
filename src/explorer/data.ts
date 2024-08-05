import { BlockStore, ContractsStore, persistentRef, TransactionsStore } from "hyle-js";
import { reactive, ref, watchEffect } from "vue";

export const network = persistentRef("network", "localhost");

export const blockStore = ref(reactive(new BlockStore(network.value)));
export const contractsStore = ref(reactive(new ContractsStore(network.value)));
export const transactionsStore = ref(reactive(new TransactionsStore(network.value)));

watchEffect(() => {
    blockStore.value = reactive(new BlockStore(network.value));
    contractsStore.value = reactive(new ContractsStore(network.value));
    transactionsStore.value = reactive(new TransactionsStore(network.value));
});

blockStore.value.loadBlocks();
transactionsStore.value.loadTxData();
contractsStore.value.loadContract();
