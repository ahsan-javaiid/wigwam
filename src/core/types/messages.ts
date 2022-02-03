import { WalletStatus, SeedPharse } from "./base";
import { AddAccountParams, Account } from "./account";
import { RpcResponse } from "./rpc";
import { ForApproval } from "./activity";

export type Request =
  | GetWalletStatusRequest
  | SetupWalletRequest
  | UnlockWalletRequest
  | LockWalletRequest
  | ChangePasswordRequest
  | HasSeedPhraseRequest
  | AddSeedPhraseRequest
  | GetAccountsRequest
  | AddAccountsRequest
  | DeleteAccountsRequest
  | GetSeedPhraseRequest
  | GetPrivateKeyRequest
  | GetPublicKeyRequest
  | GetNeuterExtendedKeyRequest
  | SendRpcRequest;

export type Response =
  | GetWalletStatusResponse
  | SetupWalletResponse
  | UnlockWalletResponse
  | LockWalletResponse
  | ChangePasswordResponse
  | HasSeedPhraseResponse
  | AddSeedPhraseResponse
  | GetAccountsResponse
  | AddAccountsResponse
  | DeleteAccountsResponse
  | GetSeedPhraseResponse
  | GetPrivateKeyResponse
  | GetPublicKeyResponse
  | GetNeuterExtendedKeyResponse
  | SendRpcResponse;

export type EventMessage =
  | WalletStatusUpdated
  | AccountsUpdated
  | AwaitingApprovalUpdated;

export enum MessageType {
  GetWalletStatus = "GET_WALLET_STATUS",
  WalletStatusUpdated = "WALLET_STATUS_UPDATED",
  SetupWallet = "SETUP_WALLET",
  UnlockWallet = "UNLOCK_WALLET",
  LockWallet = "LOCK_WALLET",
  ChangePassword = "CHANGE_PASSWORD",
  HasSeedPhrase = "HAS_SEED_PHRASE",
  AddSeedPhrase = "ADD_SEED_PHRASE",
  GetAccounts = "GET_ACCOUNTS",
  AddAccounts = "ADD_ACCOUNTS",
  DeleteAccounts = "DELETE_ACCOUNTS",
  AccountsUpdated = "ACCOUNTS_UPDATED",
  GetSeedPhrase = "GET_SEED_PHRASE",
  GetPrivateKey = "GET_PRIVATE_KEY",
  GetPublicKey = "GET_PUBLIC_KEY",
  GetNeuterExtendedKey = "GET_NEUTER_EXTENDED_KEY",
  SendRpc = "SEND_RPC",
  AwaitingApprovalUpdated = "AWAITING_APPROVAL_UPDATED",
}

export interface MessageBase {
  type: MessageType;
}

export interface GetWalletStatusRequest extends MessageBase {
  type: MessageType.GetWalletStatus;
}

export interface GetWalletStatusResponse extends MessageBase {
  type: MessageType.GetWalletStatus;
  status: WalletStatus;
}

export interface WalletStatusUpdated extends MessageBase {
  type: MessageType.WalletStatusUpdated;
  status: WalletStatus;
}

export interface SetupWalletRequest extends MessageBase {
  type: MessageType.SetupWallet;
  password: string;
  accountsParams: AddAccountParams[];
  seedPhrase?: SeedPharse;
}

export interface SetupWalletResponse extends MessageBase {
  type: MessageType.SetupWallet;
}

export interface UnlockWalletRequest extends MessageBase {
  type: MessageType.UnlockWallet;
  password: string;
}

export interface UnlockWalletResponse extends MessageBase {
  type: MessageType.UnlockWallet;
}

export interface LockWalletRequest extends MessageBase {
  type: MessageType.LockWallet;
}

export interface LockWalletResponse extends MessageBase {
  type: MessageType.LockWallet;
}

export interface ChangePasswordRequest extends MessageBase {
  type: MessageType.ChangePassword;
  currentPassword: string;
  nextPassword: string;
}

export interface ChangePasswordResponse extends MessageBase {
  type: MessageType.ChangePassword;
}

export interface HasSeedPhraseRequest extends MessageBase {
  type: MessageType.HasSeedPhrase;
}

export interface HasSeedPhraseResponse extends MessageBase {
  type: MessageType.HasSeedPhrase;
  seedPhraseExists: boolean;
}

export interface AddSeedPhraseRequest extends MessageBase {
  type: MessageType.AddSeedPhrase;
  seedPhrase: SeedPharse;
}

export interface AddSeedPhraseResponse extends MessageBase {
  type: MessageType.AddSeedPhrase;
}

export interface GetAccountsRequest extends MessageBase {
  type: MessageType.GetAccounts;
}

export interface GetAccountsResponse extends MessageBase {
  type: MessageType.GetAccounts;
  accounts: Account[];
}

export interface AddAccountsRequest extends MessageBase {
  type: MessageType.AddAccounts;
  accountsParams: AddAccountParams[];
}

export interface AddAccountsResponse extends MessageBase {
  type: MessageType.AddAccounts;
}

export interface DeleteAccountsRequest extends MessageBase {
  type: MessageType.DeleteAccounts;
  password: string;
  accountUuids: string[];
}

export interface DeleteAccountsResponse extends MessageBase {
  type: MessageType.DeleteAccounts;
}

export interface AccountsUpdated extends MessageBase {
  type: MessageType.AccountsUpdated;
  accounts: Account[];
}

export interface GetSeedPhraseRequest extends MessageBase {
  type: MessageType.GetSeedPhrase;
  password: string;
}

export interface GetSeedPhraseResponse extends MessageBase {
  type: MessageType.GetSeedPhrase;
  seedPhrase: SeedPharse;
}

export interface GetPrivateKeyRequest extends MessageBase {
  type: MessageType.GetPrivateKey;
  password: string;
  accountUuid: string;
}

export interface GetPrivateKeyResponse extends MessageBase {
  type: MessageType.GetPrivateKey;
  privateKey: string;
}

export interface GetPublicKeyRequest extends MessageBase {
  type: MessageType.GetPublicKey;
  accountUuid: string;
}

export interface GetPublicKeyResponse extends MessageBase {
  type: MessageType.GetPublicKey;
  publicKey: string;
}

export interface GetNeuterExtendedKeyRequest extends MessageBase {
  type: MessageType.GetNeuterExtendedKey;
}

export interface GetNeuterExtendedKeyResponse extends MessageBase {
  type: MessageType.GetNeuterExtendedKey;
  extendedKey: string;
}

export interface SendRpcRequest extends MessageBase {
  type: MessageType.SendRpc;
  chainId: number;
  method: string;
  params: any[];
}

export interface SendRpcResponse extends MessageBase {
  type: MessageType.SendRpc;
  response: RpcResponse;
}

export interface AwaitingApprovalUpdated extends MessageBase {
  type: MessageType.AwaitingApprovalUpdated;
  awaitingApproval: ForApproval[];
}
