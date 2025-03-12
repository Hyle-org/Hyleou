import { getNetworkIndexerApiUrl } from "@/state/network";

export type BlockInfo = {
    hash: string;
    parent_hash: string;
    height: number;
    timestamp: Date;
    //txs: string[];
};

export class BlockStore {
    network: string;
    data: Record<string, BlockInfo> = {};
    latest: string[] = [];

    tx_hashes_by_block: Record<string, string[]> = {};

    constructor(network: string) {
        this.network = network;
    }

    async loadLatest() {
        const response = await fetch(`${getNetworkIndexerApiUrl(this.network)}/v1/indexer/blocks?no_cache=${Date.now()}`);
        let resp = await response.json();
        this.latest = resp.map((block: BlockInfo) => block.hash);
        for (let item of resp) {
            this.data[item.hash] = item;
        }
    }

    async load(hash: string) {
        if (this.data[hash]) {
            return;
        }
        const response = await fetch(`${getNetworkIndexerApiUrl(this.network)}/v1/indexer/block/hash/${hash}?no_cache=${Date.now()}`);
        let item = await response.json();
        this.data[item.hash] = item;
    }

    async loadTxForBlock(hash: string) {
        if (this.tx_hashes_by_block[hash]) {
            return;
        }

        if (!this.data[hash]) {
            await this.load(hash);
        }
        // TODO: change this once I've deployed the fix
        const response = await fetch(
            `${getNetworkIndexerApiUrl(this.network)}/v1/indexer/transactions/block/${this.data[hash].height}?no_cache=${Date.now()}`,
        );
        let resp = await response.json();
        this.tx_hashes_by_block[hash] = resp.map((tx: any) => tx.tx_hash);
    }
}
