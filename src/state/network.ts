import { ref, watchEffect } from "vue";

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

export const network = persistentRef("network", "devnet");

export const getNetworkApiUrl = (network: string) => {
    return {
        localhost: "http://localhost:1317",
        devnet: "https://rest-api.devnet.hyle.eu",
    }[network];
};
