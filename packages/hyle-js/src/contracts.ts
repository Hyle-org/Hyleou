import { getNetworkApiUrl } from "@/network";

export type ContractInfo = {
    verifier: string;
    program_id: string;
    state_digest: string;
};

export class ContractsStore {
    network: string;
    contractData: Record<string, ContractInfo>;

    constructor(network: string, customData?: Record<string, ContractInfo>) {
        this.network = network;
        this.contractData = customData ?? {};
    }

    async loadContractData(contract_name: string) {
        const response = await fetch(`${getNetworkApiUrl(this.network)}/hyle/zktx/v1/contract/${contract_name}`);
        this.contractData[contract_name] = (await response.json()).contract;
    }

    async loadContract() {
        const response = await fetch(`${getNetworkApiUrl(this.network)}/hyle/zktx/v1/contracts`);
        const contracts = (await response.json()).contracts;
        for (const contract of contracts) {
            this.contractData[contract] = contract;
        }
    }
}
