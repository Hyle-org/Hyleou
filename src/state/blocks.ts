import { getNetworkApiUrl } from "@/state/network";

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

    constructor(network: string) {
        this.network = network;
    }

    async loadLatest() {
        const response = await fetch(`${getNetworkApiUrl(this.network)}/v1/indexer/blocks?no_cache=${Date.now()}`);
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
        const response = await fetch(`${getNetworkApiUrl(this.network)}/v1/indexer/block/hash/${hash}`);
        let item = await response.json();
        this.data[item.hash] = item;
    }
}
