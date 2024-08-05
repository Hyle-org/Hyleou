//[7 0 112568767309172 6 0 155498244330488045306850287589664177200672003224113 21 1000]

import { test, expect } from "bun:test";
import { Erc20Parser, deserByteArray } from "./erc20";

test("deserByteArray", () => {
    expect(deserByteArray(["0 0 0"])).toBe("");
    expect(deserByteArray(["0", "112568767309172", "6"])).toBe("faucet");
    expect(deserByteArray(["0", "155498244330488045306850287589664177200672003224113", "21"])).toBe("jenny.ecdsa_secp256r1");
    expect(
        deserByteArray([
            "2",
            "155498244330488045306850287589664177200672003224113",
            "155498244330488045306850287589664177200672003224113",
            "155498244330488045306850287589664177200672003224113",
            "21",
        ]),
    ).toBe("jenny.ecdsa_secp256r1jenny.ecdsa_secp256r1jenny.ecdsa_secp256r1");
});

test("Process pending and settled correctly", () => {
    const contract = new Erc20Parser();

    const payload = "WzcgMCAxMTI1Njg3NjczMDkxNzIgNiAwIDE1NTQ5ODI0NDMzMDQ4ODA0NTMwNjg1MDI4NzU4OTY2NDE3NzIwMDY3MjAwMzIyNDExMyAyMSAxMDAwXQ==";
    const data = new Uint8Array(Buffer.from(payload, "base64"));
    const parsedPayload = {
        identity: "0x1234",
        payloads: [
            {
                contractName: contract.contractName,
                data,
            },
        ],
    };

    expect(contract.balancesSettled).toEqual({});
    expect(contract.balancesPending).toEqual({});
    contract.balancesSettled["faucet"] = 100000;

    contract.consumePayload(parsedPayload, "1");
    contract.consumePayload(parsedPayload, "2");
    expect(contract.balancesSettled["faucet"]).toBe(100000);
    expect(contract.balancesPending["faucet"]).toBe(98000);
    expect(contract.balancesPending["jenny.ecdsa_secp256r1"]).toBe(2000);
    contract.consumePayload(parsedPayload, "3");
    contract.settleTx("1", true);
    expect(contract.balancesSettled["faucet"]).toBe(99000);
    expect(contract.balancesSettled["jenny.ecdsa_secp256r1"]).toBe(1000);
    expect(contract.balancesPending["faucet"]).toBe(98000);
    expect(contract.balancesPending["jenny.ecdsa_secp256r1"]).toBe(2000);
    contract.settleTx("2", false);
    expect(contract.balancesSettled["faucet"]).toBe(99000);
    expect(contract.balancesSettled["jenny.ecdsa_secp256r1"]).toBe(1000);
    expect(contract.balancesPending["faucet"]).toBe(99000);
    expect(contract.balancesPending["jenny.ecdsa_secp256r1"]).toBe(1000);
    contract.settleTx("3", true);
    expect(contract.balancesSettled["faucet"]).toBe(98000);
    expect(contract.balancesSettled["jenny.ecdsa_secp256r1"]).toBe(2000);
});
