import { reactive } from "vue";
import { getNetworkApiUrl, network } from "@/network";
import { loadContractTxs } from "@/transactions";

export type ContractInfo = {
    verifier: string;
    program_id: string;
    state_digest: string;
};
export const contractData = reactive({} as Record<string, ContractInfo>);

export const loadContractData = async (contract_name: string) => {
    const response = await fetch(`${getNetworkApiUrl(network.value)}/hyle/zktx/v1/contract/${contract_name}`);
    contractData[contract_name] = (await response.json()).contract;

    loadContractTxs(network.value, contract_name);
};

const loadContracts = async () => {
    const response = await fetch(`${getNetworkApiUrl(network.value)}/hyle/zktx/v1/contracts`);
    const contracts = (await response.json()).contracts;
    for (const contract of contracts) {
        contractData[contract] = contract;
    }
};
loadContracts();
