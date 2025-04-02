import { getNetworkIndexerApiUrl } from "@/state/network";

export type ContractInfo = {
    contract_name: string;
    tx_hash: string;
    verifier: string;
    program_id: string;
    state_commitment: string;
    total_transactions: number;
};

export class ContractStore {
    network: string;
    data: Record<string, ContractInfo> = {};

    constructor(network: string) {
        this.network = network;
    }

    async loadAll() {
        const response = await fetch(`${getNetworkIndexerApiUrl(this.network)}/v1/indexer/contracts?no_cache=${Date.now()}`);
        let resp = await response.json();
        for (let item of resp) {
            this.data[item.contract_name] = item;
        }
    }

    async load(contract_name: string) {
        if (this.data[contract_name]) {
            return;
        }
        const response = await fetch(
            `${getNetworkIndexerApiUrl(this.network)}/v1/indexer/contract/${contract_name}?no_cache=${Date.now()}`,
        );
        let item = await response.json();
        this.data[item.contract_name] = item;
    }
}
