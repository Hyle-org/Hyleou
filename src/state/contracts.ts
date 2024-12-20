import { getNetworkApiUrl } from "@/state/network";

export type ContractInfo = {
    contract_name: string;
};

export class ContractStore {
    network: string;
    data: Record<string, ContractInfo> = {};

    constructor(network: string) {
        this.network = network;
    }

    async loadAll() {
        const response = await fetch(`${getNetworkApiUrl(this.network)}/v1/indexer/contracts?no_cache=${Date.now()}`);
        let resp = await response.json();
        for (let item of resp) {
            this.data[item.contract_name] = item;
        }
    }

    async load(contract_name: string) {
        if (this.data[contract_name]) {
            return;
        }
        const response = await fetch(`${getNetworkApiUrl(this.network)}/v1/indexer/contract/${contract_name}`);
        let item = await response.json();
        this.data[item.contract_name] = item;
    }
}