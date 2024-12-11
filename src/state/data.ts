import { reactive, ref, watchEffect } from "vue";
import { BlockStore } from "@/state/blocks";
import { network } from "@/state/network";
import { TransactionStore } from "./transactions";

export const blockStore = ref(reactive(new BlockStore(network.value)));
//export const contractsStore = ref(reactive(new ContractsStore(network.value)));
export const transactionStore = ref(reactive(new TransactionStore(network.value)));

watchEffect(() => {
    blockStore.value = reactive(new BlockStore(network.value));
    transactionStore.value = reactive(new TransactionStore(network.value));
    //contractsStore.value = reactive(new ContractsStore(network.value));

    blockStore.value.loadBlocks();
    transactionStore.value.loadLatestTransactions();
    //contractsStore.value.loadContract();
});
