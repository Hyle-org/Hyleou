import { BorshSchema, borshDeserialize } from "borsher";

export type IdentityAction =
    | {
          RegisterIdentity: {
              account: string;
              nonce: number;
          };
      }
    | {
          VerifyIdentity: {
              nonce: number;
              account: string;
          };
      };

//
// Serialisation
//

export const deserializeWalletAction = (data: number[]): IdentityAction => {
    return borshDeserialize(schema, new Uint8Array(data));
};

const schema = BorshSchema.Enum({
    RegisterIdentity: BorshSchema.Struct({
        account: BorshSchema.String,
        nonce: BorshSchema.u128,
    }),
    VerifyIdentity: BorshSchema.Struct({
        account: BorshSchema.String,
        nonce: BorshSchema.u128,
    }),
});
