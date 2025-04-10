import { borshSerialize, BorshSchema, borshDeserialize } from "borsher";
import { Blob } from "hyle";

export const blackjackContractName = "blackjack";

//
// Types
//

export type BlackJackAction =
    | { Init: {} }
    | { Hit: {} }
    | { Stand: {} }
    | { DoubleDown: {} }
    | { Claim: {} };

export type UniqueAction = {
    id: number;
    action: BlackJackAction;
};

//
// Builders
//

export const init = (id: number): Blob => {
    const action: BlackJackAction = {
        Init: {},
    };
    const uniqueAction: UniqueAction = {
        id,
        action,
    };
    const blob: Blob = {
        contract_name: blackjackContractName,
        data: serializeUniqueAction(uniqueAction),
    };
    return blob;
};

export const hit = (id: number): Blob => {
    const action: BlackJackAction = {
        Hit: {},
    };
    const uniqueAction: UniqueAction = {
        id,
        action,
    };
    const blob: Blob = {
        contract_name: blackjackContractName,
        data: serializeUniqueAction(uniqueAction),
    };
    return blob;
};

export const stand = (id: number): Blob => {
    const action: BlackJackAction = {
        Stand: {},
    };
    const uniqueAction: UniqueAction = {
        id,
        action,
    };
    const blob: Blob = {
        contract_name: blackjackContractName,
        data: serializeUniqueAction(uniqueAction),
    };
    return blob;
};

export const doubleDown = (id: number): Blob => {
    const action: BlackJackAction = {
        DoubleDown: {},
    };
    const uniqueAction: UniqueAction = {
        id,
        action,
    };
    const blob: Blob = {
        contract_name: blackjackContractName,
        data: serializeUniqueAction(uniqueAction),
    };
    return blob;
};

export const claim = (id: number): Blob => {
    const action: BlackJackAction = {
        Claim: {},
    };
    const uniqueAction: UniqueAction = {
        id,
        action,
    };
    const blob: Blob = {
        contract_name: blackjackContractName,
        data: serializeUniqueAction(uniqueAction),
    };
    return blob;
};

//
// Serialisation
//

const serializeUniqueAction = (action: UniqueAction): number[] => {
    return Array.from(borshSerialize(schema, action));
};

export const deserializeBlackJackAction = (data: number[]): UniqueAction => {
    return borshDeserialize(schema, new Uint8Array(data));
};

const schema = BorshSchema.Struct({
    id: BorshSchema.u64,
    action: BorshSchema.Enum({
        Init: BorshSchema.Struct({}),
        Hit: BorshSchema.Struct({}),
        Stand: BorshSchema.Struct({}),
        DoubleDown: BorshSchema.Struct({}),
        Claim: BorshSchema.Struct({}),
    }),
}); 