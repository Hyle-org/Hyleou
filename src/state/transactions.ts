import { getNetworkApiUrl } from "@/state/network";

export type TransactionInfo = {
    tx_hash: string;
    block_hash: string;
    transaction_type: string | "RegisterContractTransaction";
    transaction_status: string | "Success";
};

export class TransactionStore {
    network: string;
    transaction: Record<string, TransactionInfo> = {};
    latest_transactions: string[] = [];

    constructor(network: string) {
        this.network = network;
    }

    async loadLatestTransactions() {
        const response = await fetch(`${getNetworkApiUrl(this.network)}/v1/indexer/transactions?no_cache=${Date.now()}`);
        let resp = await response.json();
        this.latest_transactions = resp.map((tx: TransactionInfo) => tx.tx_hash);
        for (let tx of resp) {
            this.transaction[tx.tx_hash] = tx;
        }
        console.log(this);
    }
}
