import { getNetworkApiUrl } from "@/state/network";

export type TransactionInfo = {
    tx_hash: string;
    block_hash: string;
    transaction_type: string | "RegisterContractTransaction";
    transaction_status: string | "Success";
};

export class TransactionStore {
    network: string;
    data: Record<string, TransactionInfo> = {};
    latest: string[] = [];

    constructor(network: string) {
        this.network = network;
    }

    async loadLatest() {
        const response = await fetch(`${getNetworkApiUrl(this.network)}/v1/indexer/transactions?no_cache=${Date.now()}`);
        let resp = await response.json();
        this.latest = resp.map((tx: TransactionInfo) => tx.tx_hash);
        for (let item of resp) {
            this.data[item.tx_hash] = item;
        }
    }

    async load(tx_hash: string) {
        if (this.data[tx_hash]) {
            return;
        }
        const response = await fetch(`${getNetworkApiUrl(this.network)}/v1/indexer/transaction/hash/${tx_hash}?no_cache=${Date.now()}`);
        let item = await response.json();
        this.data[item.tx_hash] = item;
    }
}
