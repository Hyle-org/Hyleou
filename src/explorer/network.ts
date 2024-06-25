import { ref } from 'vue';

export const network = ref('devnet');

export const getNetworkApiUrl = (network: string) => {
    return {
        localhost: 'http://localhost:1317',
        devnet: 'https://api.devnet.hyle.eu',
    }[network];
};

export const getNetworkRpcUrl = (network: string) => {
    return {
        localhost: 'http://localhost:26657',
        devnet: 'https://rpc.devnet.hyle.eu',
    }[network];
};

export const getNetworkWebsocketUrl = (network: string) => {
    return {
        localhost: 'ws://localhost:26657/websocket',
        devnet: 'wss://rpc.devnet.hyle.eu/websocket',
    }[network];
};
