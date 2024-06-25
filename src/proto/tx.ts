// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.178.0
//   protoc               unknown
// source: hyle/zktx/v1/tx.proto

/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { Params } from "./types";

export const protobufPackage = "hyle.zktx.v1";

/** StateChange is a zk-proven state change to be executed */
export interface StateChange {
  /** Name of target contract */
  contractName: string;
  /** Proof of the transaction */
  proof: Uint8Array;
}

/** execute a zk-proven state change - request type */
export interface MsgExecuteStateChanges {
  /** list of state changes to execute */
  stateChanges: StateChange[];
}

/** No response */
export interface MsgExecuteStateChangesResponse {
}

/** Only verify a ZK proof - request type */
export interface MsgVerifyProof {
  /** Contract the proof is being sent to */
  contractName: string;
  /** Proof of the transaction */
  proof: Uint8Array;
}

/** No response */
export interface MsgVerifyProofResponse {
}

/** Register a contract - request type */
export interface MsgRegisterContract {
  /** owner is the contract owner */
  owner: string;
  /** Identifier of the verifier */
  verifier: string;
  /** Identifier of the smart contract */
  programId: Uint8Array;
  /** Initial state digest */
  stateDigest: Uint8Array;
  /** Identifier of the contract name */
  contractName: string;
}

/** Register a contract - response type */
export interface MsgRegisterContractResponse {
}

/** MsgUpdateParams is the Msg/UpdateParams request type. */
export interface MsgUpdateParams {
  /**
   * authority is the address that controls the module
   * NOTE: Defaults to the governance module unless overwritten.
   */
  authority: string;
  /**
   * params defines the module parameters to update.
   * NOTE: All parameters must be supplied.
   */
  params: Params | undefined;
}

/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 */
export interface MsgUpdateParamsResponse {
}

function createBaseStateChange(): StateChange {
  return { contractName: "", proof: new Uint8Array(0) };
}

export const StateChange = {
  encode(message: StateChange, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contractName !== "") {
      writer.uint32(10).string(message.contractName);
    }
    if (message.proof.length !== 0) {
      writer.uint32(18).bytes(message.proof);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StateChange {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStateChange();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contractName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.proof = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StateChange {
    return {
      contractName: isSet(object.contractName) ? globalThis.String(object.contractName) : "",
      proof: isSet(object.proof) ? bytesFromBase64(object.proof) : new Uint8Array(0),
    };
  },

  toJSON(message: StateChange): unknown {
    const obj: any = {};
    if (message.contractName !== "") {
      obj.contractName = message.contractName;
    }
    if (message.proof.length !== 0) {
      obj.proof = base64FromBytes(message.proof);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StateChange>, I>>(base?: I): StateChange {
    return StateChange.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StateChange>, I>>(object: I): StateChange {
    const message = createBaseStateChange();
    message.contractName = object.contractName ?? "";
    message.proof = object.proof ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMsgExecuteStateChanges(): MsgExecuteStateChanges {
  return { stateChanges: [] };
}

export const MsgExecuteStateChanges = {
  encode(message: MsgExecuteStateChanges, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.stateChanges) {
      StateChange.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExecuteStateChanges {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExecuteStateChanges();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.stateChanges.push(StateChange.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgExecuteStateChanges {
    return {
      stateChanges: globalThis.Array.isArray(object?.stateChanges)
        ? object.stateChanges.map((e: any) => StateChange.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MsgExecuteStateChanges): unknown {
    const obj: any = {};
    if (message.stateChanges?.length) {
      obj.stateChanges = message.stateChanges.map((e) => StateChange.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgExecuteStateChanges>, I>>(base?: I): MsgExecuteStateChanges {
    return MsgExecuteStateChanges.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgExecuteStateChanges>, I>>(object: I): MsgExecuteStateChanges {
    const message = createBaseMsgExecuteStateChanges();
    message.stateChanges = object.stateChanges?.map((e) => StateChange.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgExecuteStateChangesResponse(): MsgExecuteStateChangesResponse {
  return {};
}

export const MsgExecuteStateChangesResponse = {
  encode(_: MsgExecuteStateChangesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgExecuteStateChangesResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgExecuteStateChangesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgExecuteStateChangesResponse {
    return {};
  },

  toJSON(_: MsgExecuteStateChangesResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgExecuteStateChangesResponse>, I>>(base?: I): MsgExecuteStateChangesResponse {
    return MsgExecuteStateChangesResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgExecuteStateChangesResponse>, I>>(_: I): MsgExecuteStateChangesResponse {
    const message = createBaseMsgExecuteStateChangesResponse();
    return message;
  },
};

function createBaseMsgVerifyProof(): MsgVerifyProof {
  return { contractName: "", proof: new Uint8Array(0) };
}

export const MsgVerifyProof = {
  encode(message: MsgVerifyProof, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contractName !== "") {
      writer.uint32(10).string(message.contractName);
    }
    if (message.proof.length !== 0) {
      writer.uint32(18).bytes(message.proof);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgVerifyProof {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVerifyProof();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.contractName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.proof = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgVerifyProof {
    return {
      contractName: isSet(object.contractName) ? globalThis.String(object.contractName) : "",
      proof: isSet(object.proof) ? bytesFromBase64(object.proof) : new Uint8Array(0),
    };
  },

  toJSON(message: MsgVerifyProof): unknown {
    const obj: any = {};
    if (message.contractName !== "") {
      obj.contractName = message.contractName;
    }
    if (message.proof.length !== 0) {
      obj.proof = base64FromBytes(message.proof);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgVerifyProof>, I>>(base?: I): MsgVerifyProof {
    return MsgVerifyProof.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgVerifyProof>, I>>(object: I): MsgVerifyProof {
    const message = createBaseMsgVerifyProof();
    message.contractName = object.contractName ?? "";
    message.proof = object.proof ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMsgVerifyProofResponse(): MsgVerifyProofResponse {
  return {};
}

export const MsgVerifyProofResponse = {
  encode(_: MsgVerifyProofResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgVerifyProofResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVerifyProofResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgVerifyProofResponse {
    return {};
  },

  toJSON(_: MsgVerifyProofResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgVerifyProofResponse>, I>>(base?: I): MsgVerifyProofResponse {
    return MsgVerifyProofResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgVerifyProofResponse>, I>>(_: I): MsgVerifyProofResponse {
    const message = createBaseMsgVerifyProofResponse();
    return message;
  },
};

function createBaseMsgRegisterContract(): MsgRegisterContract {
  return { owner: "", verifier: "", programId: new Uint8Array(0), stateDigest: new Uint8Array(0), contractName: "" };
}

export const MsgRegisterContract = {
  encode(message: MsgRegisterContract, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.owner !== "") {
      writer.uint32(10).string(message.owner);
    }
    if (message.verifier !== "") {
      writer.uint32(18).string(message.verifier);
    }
    if (message.programId.length !== 0) {
      writer.uint32(26).bytes(message.programId);
    }
    if (message.stateDigest.length !== 0) {
      writer.uint32(34).bytes(message.stateDigest);
    }
    if (message.contractName !== "") {
      writer.uint32(42).string(message.contractName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterContract {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.owner = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.verifier = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.programId = reader.bytes();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.stateDigest = reader.bytes();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.contractName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterContract {
    return {
      owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
      verifier: isSet(object.verifier) ? globalThis.String(object.verifier) : "",
      programId: isSet(object.programId) ? bytesFromBase64(object.programId) : new Uint8Array(0),
      stateDigest: isSet(object.stateDigest) ? bytesFromBase64(object.stateDigest) : new Uint8Array(0),
      contractName: isSet(object.contractName) ? globalThis.String(object.contractName) : "",
    };
  },

  toJSON(message: MsgRegisterContract): unknown {
    const obj: any = {};
    if (message.owner !== "") {
      obj.owner = message.owner;
    }
    if (message.verifier !== "") {
      obj.verifier = message.verifier;
    }
    if (message.programId.length !== 0) {
      obj.programId = base64FromBytes(message.programId);
    }
    if (message.stateDigest.length !== 0) {
      obj.stateDigest = base64FromBytes(message.stateDigest);
    }
    if (message.contractName !== "") {
      obj.contractName = message.contractName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterContract>, I>>(base?: I): MsgRegisterContract {
    return MsgRegisterContract.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterContract>, I>>(object: I): MsgRegisterContract {
    const message = createBaseMsgRegisterContract();
    message.owner = object.owner ?? "";
    message.verifier = object.verifier ?? "";
    message.programId = object.programId ?? new Uint8Array(0);
    message.stateDigest = object.stateDigest ?? new Uint8Array(0);
    message.contractName = object.contractName ?? "";
    return message;
  },
};

function createBaseMsgRegisterContractResponse(): MsgRegisterContractResponse {
  return {};
}

export const MsgRegisterContractResponse = {
  encode(_: MsgRegisterContractResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterContractResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterContractResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgRegisterContractResponse {
    return {};
  },

  toJSON(_: MsgRegisterContractResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterContractResponse>, I>>(base?: I): MsgRegisterContractResponse {
    return MsgRegisterContractResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterContractResponse>, I>>(_: I): MsgRegisterContractResponse {
    const message = createBaseMsgRegisterContractResponse();
    return message;
  },
};

function createBaseMsgUpdateParams(): MsgUpdateParams {
  return { authority: "", params: undefined };
}

export const MsgUpdateParams = {
  encode(message: MsgUpdateParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authority = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? globalThis.String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: MsgUpdateParams): unknown {
    const obj: any = {};
    if (message.authority !== "") {
      obj.authority = message.authority;
    }
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(base?: I): MsgUpdateParams {
    return MsgUpdateParams.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(object: I): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}

export const MsgUpdateParamsResponse = {
  encode(_: MsgUpdateParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },

  toJSON(_: MsgUpdateParamsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(base?: I): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(_: I): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
};

/** Msg defines the module Msg service. */
export interface Msg {
  /** execute a zk-proven state change */
  ExecuteStateChanges(request: MsgExecuteStateChanges): Promise<MsgExecuteStateChangesResponse>;
  /** Only verify a ZK proof */
  VerifyProof(request: MsgVerifyProof): Promise<MsgVerifyProofResponse>;
  /** RegisterContract registers a contract */
  RegisterContract(request: MsgRegisterContract): Promise<MsgRegisterContractResponse>;
  /** UpdateParams updates the module parameters. */
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
}

export const MsgServiceName = "hyle.zktx.v1.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.ExecuteStateChanges = this.ExecuteStateChanges.bind(this);
    this.VerifyProof = this.VerifyProof.bind(this);
    this.RegisterContract = this.RegisterContract.bind(this);
    this.UpdateParams = this.UpdateParams.bind(this);
  }
  ExecuteStateChanges(request: MsgExecuteStateChanges): Promise<MsgExecuteStateChangesResponse> {
    const data = MsgExecuteStateChanges.encode(request).finish();
    const promise = this.rpc.request(this.service, "ExecuteStateChanges", data);
    return promise.then((data) => MsgExecuteStateChangesResponse.decode(_m0.Reader.create(data)));
  }

  VerifyProof(request: MsgVerifyProof): Promise<MsgVerifyProofResponse> {
    const data = MsgVerifyProof.encode(request).finish();
    const promise = this.rpc.request(this.service, "VerifyProof", data);
    return promise.then((data) => MsgVerifyProofResponse.decode(_m0.Reader.create(data)));
  }

  RegisterContract(request: MsgRegisterContract): Promise<MsgRegisterContractResponse> {
    const data = MsgRegisterContract.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterContract", data);
    return promise.then((data) => MsgRegisterContractResponse.decode(_m0.Reader.create(data)));
  }

  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateParams", data);
    return promise.then((data) => MsgUpdateParamsResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
