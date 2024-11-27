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
    blocks: BlockInfo[];

    constructor(network: string) {
        this.network = network;
        this.blocks = [];
    }

    async loadBlocks() {
        const response = await fetch(`${getNetworkApiUrl(this.network)}/v1/indexer/blocks?no_cache=${Date.now()}`);
        this.blocks = await response.json();
    }
}
