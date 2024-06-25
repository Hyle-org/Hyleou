import { AccountData, DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import {
    SigningStargateClient,
    defaultRegistryTypes,
} from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

// A message type auto-generated from .proto files using ts-proto. @cosmjs/stargate ships some
// common types but don't rely on those being available. You need to set up your own code generator
// for the types you care about. How this is done should be documented, but is not yet:
// https://github.com/cosmos/cosmjs/issues/640
import { MsgExecuteStateChanges } from "./proto/tx.ts"; 

const mnemonic = "surround miss nominee dream gap cross assault thank captain prosper drop duty group candy wealth weather scale put";

let client: SigningStargateClient;
let firstAccount: AccountData;

export async function setupCosmos(address: string) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "hyle" });
    [firstAccount] = await wallet.getAccounts();

    const rpcEndpoint = address;
    client = await SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        wallet,
        {
            registry: new Registry([
                ...defaultRegistryTypes,
                ["/hyle.zktx.v1.MsgExecuteStateChanges", MsgExecuteStateChanges],
            ]),
        },
    );
}

export async function broadcastTx(
    ecdsaProof: string,
    smileProof: string,
    erc20Proof: string,
) {
    const msgAny = {
        typeUrl: "/hyle.zktx.v1.MsgExecuteStateChanges",
        value: {
            stateChanges: [
                {
                    contractName: "ecdsa_secp256r1",
                    proof: window.btoa(ecdsaProof),
                },
                {
                    contractName: "smile",
                    proof: window.btoa(smileProof),
                },
                {
                    contractName: "erc20",
                    proof: window.btoa(erc20Proof),
                },
            ],
        }
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
    return await client.broadcastTx(Uint8Array.from(TxRaw.encode(signedTx).finish()))
};

export async function checkTxStatus(hash: string) {
    const resp = await client.getTx(hash);
    if (resp?.code !== 0) {
        return {
            "status": "failed",
            "error": resp?.rawLog || "unknown error"
        }
    }
    return {
        "status": "success"
    }
}