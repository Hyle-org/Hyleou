import { BorshSchema, borshDeserialize } from "borsher";
import { StructuredBlobData, structuredBlobDataSchema } from "hyle";

export type TimeoutWindow = { NoTimeout: {} } | { Timeout: number };

export interface RegisterContractAction {
    verifier: string;
    program_id: Uint8Array;
    state_commitment: Uint8Array;
    contract_name: string;
    timeout_window: TimeoutWindow | null;
}

export interface DeleteContractAction {
    contract_name: string;
}

export const deserializeHyleAction = (
    data: number[],
): StructuredBlobData<RegisterContractAction> | StructuredBlobData<DeleteContractAction> => {
    try {
        return deserializeRegisterContractAction(data);
    } catch (e) {
        console.log("Failed to deserialize RegisterContractAction, trying DeleteContractAction");
        try {
            return deserializeDeleteContractAction(data);
        } catch (e) {
            throw new Error("Failed to deserialize Hyle action");
        }
    }
};

export const deserializeRegisterContractAction = (data: number[]): StructuredBlobData<RegisterContractAction> => {
    return borshDeserialize(structuredBlobDataSchema(registerContractActionSchema), new Uint8Array(data));
};

export const deserializeTimeoutWindow = (data: number[]): TimeoutWindow => {
    return borshDeserialize(timeoutWindowSchema, new Uint8Array(data));
};

export const deserializeDeleteContractAction = (data: number[]): StructuredBlobData<DeleteContractAction> => {
    return borshDeserialize(structuredBlobDataSchema(deleteContractActionSchema), new Uint8Array(data));
};

export const deleteContractActionSchema = BorshSchema.Struct({
    contract_name: BorshSchema.String,
});

export const timeoutWindowSchema = BorshSchema.Enum({
    NoTimeout: BorshSchema.Struct({}),
    Timeout: BorshSchema.u64,
});

const registerContractActionSchema = BorshSchema.Struct({
    verifier: BorshSchema.String,
    program_id: BorshSchema.Vec(BorshSchema.u8),
    state_commitment: BorshSchema.Vec(BorshSchema.u8),
    contract_name: BorshSchema.String,
    timeout_window: BorshSchema.Option(timeoutWindowSchema),
});
