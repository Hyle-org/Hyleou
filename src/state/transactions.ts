import { getNetworkIndexerApiUrl } from "@/state/network";

export type TransactionInfo = {
    tx_hash: string;
    block_hash: string;
    transaction_type: string;
    transaction_status: string | "Success";
};

export class TransactionStore {
    network: string;
    data: Record<string, TransactionInfo> = {};
    latest: string[] = [];
    transactionsByBlock: Record<string, string[]> = {};

    constructor(network: string) {
        this.network = network;
    }

    private updateTransactionsByBlock(transaction: TransactionInfo) {
        if (transaction.block_hash) {
            if (!this.transactionsByBlock[transaction.block_hash]) {
                this.transactionsByBlock[transaction.block_hash] = [];
            }
            if (!this.transactionsByBlock[transaction.block_hash].includes(transaction.tx_hash)) {
                this.transactionsByBlock[transaction.block_hash].push(transaction.tx_hash);
            }
        }
    }

    async loadLatest() {
        const response = await fetch(`${getNetworkIndexerApiUrl(this.network)}/v1/indexer/transactions?no_cache=${Date.now()}`);
        let resp = await response.json();
        this.latest = resp.map((tx: TransactionInfo) => tx.tx_hash);
        for (let item of resp) {
            this.data[item.tx_hash] = item;
            this.updateTransactionsByBlock(item);
        }
    }

    async load(tx_hash: string) {
        if (this.data[tx_hash]) {
            return;
        }
        const response = await fetch(
            `${getNetworkIndexerApiUrl(this.network)}/v1/indexer/transaction/hash/${tx_hash}?no_cache=${Date.now()}`,
        );
        let item = await response.json();
        this.data[item.tx_hash] = item;
        this.updateTransactionsByBlock(item);
    }

    async getTransactionsByBlockHeight(height: number): Promise<string[]> {
        const response = await fetch(
            `${getNetworkIndexerApiUrl(this.network)}/v1/indexer/transactions/block/${height}?no_cache=${Date.now()}`,
        );
        const transactions = await response.json();
        const txHashes = transactions.map((tx: TransactionInfo) => tx.tx_hash);

        // Cache the transactions data and update transactionsByBlock
        transactions.forEach((tx: TransactionInfo) => {
            this.data[tx.tx_hash] = tx;
            this.updateTransactionsByBlock(tx);
        });

        return txHashes;
    }

    async getTransactionsByBlockHash(blockHash: string, height: number): Promise<string[]> {
        if (this.transactionsByBlock[blockHash]) {
            return this.transactionsByBlock[blockHash];
        }

        const txHashes = await this.getTransactionsByBlockHeight(height);
        // Note: We don't need to explicitly set transactionsByBlock[blockHash] here
        // because updateTransactionsByBlock will have already done it when processing
        // the transactions from getTransactionsByBlockHeight
        return txHashes;
    }
}
