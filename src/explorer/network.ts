import { ref, watch } from "vue";

class LocalStorageService {
    static save(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static load<T>(key: string): T | null {
        try {
            const jsonValue = localStorage.getItem(key);
            if (jsonValue) return JSON.parse(jsonValue) as T;
        } catch (_) {
            localStorage.removeItem(key);
        }
        return null;
    }
}

export function persistentRef<T>(key: string, initialValue: T) {
    const storedValue = LocalStorageService.load<T>(key);
    const dataRef = ref<T>(storedValue ?? initialValue);

    watch(
        dataRef,
        (newValue) => {
            LocalStorageService.save(key, newValue);
        },
        { deep: true },
    );

    return dataRef;
}

export const network = persistentRef("network", "devnet");

export const getNetworkApiUrl = (network: string) => {
    return {
        localhost: "http://localhost:1317",
        devnet: "https://api.devnet.hyle.eu",
    }[network];
};

export const getNetworkRpcUrl = (network: string) => {
    return {
        localhost: "http://localhost:26657",
        devnet: "https://rpc.devnet.hyle.eu",
    }[network];
};

export const getNetworkWebsocketUrl = (network: string) => {
    return {
        localhost: "ws://localhost:26657/websocket",
        devnet: "wss://rpc.devnet.hyle.eu/websocket",
    }[network];
};
