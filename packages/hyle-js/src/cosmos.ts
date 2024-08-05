import type { AccountData } from "@cosmjs/proto-signing";
import type { SigningStargateClient } from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

// A message type auto-generated from .proto files using ts-proto. @cosmjs/stargate ships some
// common types but don't rely on those being available. You need to set up your own code generator
// for the types you care about. How this is done should be documented, but is not yet:
// https://github.com/cosmos/cosmjs/issues/640
import { MsgPublishPayloadProof, MsgRegisterContract } from "./proto/tx.ts";
import { getNetworkApiUrl } from "./network.ts";
import { hexToUint8Array, uint8ArrayToBase64 } from "./utils.ts";

const mnemonic = "surround miss nominee dream gap cross assault thank captain prosper drop duty group candy wealth weather scale put";

let client: SigningStargateClient;
let firstAccount: AccountData;

export async function setupCosmos(address: string) {
    if (client) return;

    // Loaded asynchronously because they are rather heavy.
    const { DirectSecp256k1HdWallet, Registry } = await import("@cosmjs/proto-signing");
    const { SigningStargateClient } = await import("@cosmjs/stargate");

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: "hyle",
    });
    [firstAccount] = await wallet.getAccounts();

    const rpcEndpoint = address;
    client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, {
        registry: new Registry([
            ["/hyle.zktx.v1.MsgPublishPayloadProof", MsgPublishPayloadProof],
            ["/hyle.zktx.v1.MsgRegisterContract", MsgRegisterContract],
        ]),
    });
}

// Proof should be base64, hash should be hex
export async function broadcastProofTx(hash: string, payloadIndex: number, contractName: string, proof: string) {
    const msgAny = {
        typeUrl: "/hyle.zktx.v1.MsgPublishPayloadProof",
        value: {
            txHash: uint8ArrayToBase64(hexToUint8Array(hash)),
            payloadIndex: payloadIndex,
            contractName: contractName,
            proof: proof,
        },
    };
    const fee = {
        amount: [
            {
                denom: "hyle",
                amount: "2000",
            },
        ],
        gas: "180000", // 180k
    };
    const signedTx = await client.sign(firstAccount.address, [msgAny], fee, "", {
        accountNumber: 1,
        sequence: 1,
        chainId: "hyle",
    });
    // For now our transactions are always included.
    return await client.broadcastTx(Uint8Array.from(TxRaw.encode(signedTx).finish()));
}

export async function broadcastPayloadTx(payloads: { contractName: string; payload: string }[]) {
    const msgAny = {
        typeUrl: "/hyle.zktx.v1.MsgPublishPayloads",
        value: {
            payloads,
        },
    };
    const fee = {
        amount: [
            {
                denom: "hyle",
                amount: "2000",
            },
        ],
        gas: "180000", // 180k
    };
    const signedTx = await client.sign(firstAccount.address, [msgAny], fee, "", {
        accountNumber: 1,
        sequence: 1,
        chainId: "hyle",
    });
    // For now our transactions are always included.
    return await client.broadcastTx(Uint8Array.from(TxRaw.encode(signedTx).finish()));
}

export async function checkTxStatus(hash: string) {
    const resp = await client.getTx(hash);
    if (resp?.code !== 0) {
        return {
            status: "failed",
            error: resp?.rawLog || "unknown error",
        };
    }
    return {
        status: "success",
    };
}

export async function checkContractExists(network: string, contractName: string) {
    const checkExists = await fetch(`${getNetworkApiUrl(network)}/hyle/zktx/v1/contract/${contractName}`);
    try {
        return (await checkExists.json()).contract.verifier != "";
    } catch (e) {
        return false;
    }
}

export async function registerContract(verifier: string, contractName: string, programId: Uint8Array, stateDigest: Uint8Array) {
    let msgAny = {
        typeUrl: "/hyle.zktx.v1.MsgRegisterContract",
        value: {
            owner: firstAccount.address,
            verifier,
            contractName,
            programId,
            stateDigest,
        } as MsgRegisterContract,
    };
    const fee = {
        amount: [
            {
                denom: "hyle",
                amount: "2000",
            },
        ],
        gas: "180000", // 180k
    };
    let signedTx = await client.sign(firstAccount.address, [msgAny], fee, "", {
        accountNumber: 1,
        sequence: 1,
        chainId: "hyle",
    });
    return await client.broadcastTx(Uint8Array.from(TxRaw.encode(signedTx).finish()));
}
