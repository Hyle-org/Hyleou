import { BlockStore, ContractsStore, TransactionsStore } from "hyle-js";
import { reactive, ref, watchEffect } from "vue";

class LocalStorageService {
    static save(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static load<T>(key: string): T | null {
        try {
            const jsonValue = localStorage.getItem(key);
            if (jsonValue) return JSON.parse(jsonValue) as T;
        } catch (_) {
            // Might not exist in test envs
            try {
                localStorage.removeItem(key);
            } catch (_) {}
        }
        return null;
    }
}

export const persistentRef = <T>(key: string, initialValue: T) => {
    const storedValue = LocalStorageService.load<T>(key);
    const dataRef = ref<T>(storedValue ?? initialValue);

    watchEffect(() => {
        LocalStorageService.save(key, dataRef.value);
    });

    return dataRef;
};

export const network = persistentRef("network", "localhost");

export const blockStore = ref(reactive(new BlockStore(network.value)));
export const contractsStore = ref(reactive(new ContractsStore(network.value)));
export const transactionsStore = ref(reactive(new TransactionsStore(network.value)));

watchEffect(() => {
    blockStore.value = reactive(new BlockStore(network.value));
    contractsStore.value = reactive(new ContractsStore(network.value));
    transactionsStore.value = reactive(new TransactionsStore(network.value));

    blockStore.value.loadBlocks();
    transactionsStore.value.loadTxData();
    contractsStore.value.loadContract();
});
