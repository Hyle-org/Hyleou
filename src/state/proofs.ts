import { getNetworkIndexerApiUrl } from "@/state/network";

export type ProofInfo = {
    tx_hash: string;
    parent_dp_hash: string;
    version: number;
    transaction_type: string;
    transaction_status: string;
    block_hash: string;
    index: number;
};

export class ProofStore {
    network: string;
    data: Record<string, ProofInfo> = {};
    latest: string[] = [];

    constructor(network: string) {
        this.network = network;
    }

    async loadLatest() {
        const response = await fetch(`${getNetworkIndexerApiUrl(this.network)}/v1/indexer/proofs?no_cache=${Date.now()}`);
        let resp = await response.json();
        this.latest = resp.map((proof: ProofInfo) => proof.tx_hash);
        for (let item of resp) {
            this.data[item.tx_hash] = item;
        }
    }

    async load(tx_hash: string) {
        if (this.data[tx_hash]) {
            return;
        }
        const response = await fetch(`${getNetworkIndexerApiUrl(this.network)}/v1/indexer/proof/hash/${tx_hash}?no_cache=${Date.now()}`);
        let item = await response.json();
        this.data[item.tx_hash] = item;
    }
}
