import { match } from "ts-pattern";
import { PorterServer, MessageContext } from "lib/ext/porter/server";

import {
  Request,
  Response,
  EventMessage,
  MessageType,
  PorterChannel,
  WalletStatus,
} from "core/types";

import {
  $walletStatus,
  $accounts,
  $awaitingApproval,
  ensureInited,
  withStatus,
  withVault,
  locked,
  unlocked,
  walletPortsCountUpdated,
  accountsUpdated,
} from "./state";
import { Vault } from "./vault";
import { handleRpc } from "./rpc";

export function startServer() {
  const walletPorter = new PorterServer<EventMessage>(PorterChannel.Wallet);

  walletPorter.onConnection(() => {
    walletPortsCountUpdated(walletPorter.portsCount);
  });

  walletPorter.onMessage<Request, Response>(handleWalletRequest);

  $walletStatus.watch((status) => {
    walletPorter.broadcast({ type: MessageType.WalletStatusUpdated, status });
  });

  $accounts.watch((accounts) => {
    walletPorter.broadcast({ type: MessageType.AccountsUpdated, accounts });
  });

  $awaitingApproval.watch((awaitingApproval) => {
    walletPorter.broadcast({
      type: MessageType.AwaitingApprovalUpdated,
      awaitingApproval,
    });
  });

  // const dappPorter = new PorterServer(PorterChannel.DApp);
  // dappPorter.onMessage(handleDAppRequest);
}

async function handleWalletRequest(ctx: MessageContext<Request, Response>) {
  console.debug("New wallet request", ctx);

  if (!ctx.request) return;

  try {
    await ensureInited();

    await match(ctx.data)
      .with({ type: MessageType.GetWalletStatus }, async ({ type }) => {
        const status = $walletStatus.getState();

        ctx.reply({ type, status });
      })
      .with(
        { type: MessageType.SetupWallet },
        ({ type, passwordHash, accountsParams, seedPhrase }) =>
          withStatus([WalletStatus.Welcome, WalletStatus.Locked], async () => {
            const vault = await Vault.setup(
              passwordHash,
              accountsParams,
              seedPhrase
            );

            const accounts = vault.getAccounts();
            unlocked({ vault, accounts });

            ctx.reply({ type });
          })
      )
      .with({ type: MessageType.UnlockWallet }, ({ type, passwordHash }) =>
        withStatus(WalletStatus.Locked, async () => {
          const vault = await Vault.unlock(passwordHash);

          const accounts = vault.getAccounts();
          unlocked({ vault, accounts });

          ctx.reply({ type });
        })
      )
      .with({ type: MessageType.LockWallet }, ({ type }) => {
        locked();

        ctx.reply({ type });
      })
      .with({ type: MessageType.HasSeedPhrase }, async ({ type }) =>
        withVault(async (vault) => {
          const seedPhraseExists = vault.isSeedPhraseExists();

          ctx.reply({ type, seedPhraseExists });
        })
      )
      .with({ type: MessageType.AddSeedPhrase }, ({ type, seedPhrase }) =>
        withVault(async (vault) => {
          await vault.addSeedPhrase(seedPhrase);

          ctx.reply({ type });
        })
      )
      .with({ type: MessageType.GetAccounts }, ({ type }) =>
        withVault(async (vault) => {
          const accounts = vault.getAccounts();

          ctx.reply({ type, accounts });
        })
      )
      .with({ type: MessageType.AddAccounts }, ({ type, accountsParams }) =>
        withVault(async (vault) => {
          await vault.addAccounts(accountsParams);

          const accounts = vault.getAccounts();
          accountsUpdated(accounts);

          ctx.reply({ type });
        })
      )
      .with(
        { type: MessageType.DeleteAccounts },
        ({ type, passwordHash, accountUuids }) =>
          withVault(async (vault) => {
            await vault.deleteAccounts(passwordHash, accountUuids);

            const accounts = vault.getAccounts();
            accountsUpdated(accounts);

            ctx.reply({ type });
          })
      )
      .with({ type: MessageType.GetSeedPhrase }, ({ type, passwordHash }) =>
        withVault(async (vault) => {
          const seedPhrase = vault.getSeedPhrase(passwordHash);

          ctx.reply({ type, seedPhrase });
        })
      )
      .with(
        { type: MessageType.GetPrivateKey },
        ({ type, passwordHash, accountUuid }) =>
          withVault(async (vault) => {
            const privateKey = vault.getPrivateKey(passwordHash, accountUuid);

            ctx.reply({ type, privateKey });
          })
      )
      .with({ type: MessageType.GetPublicKey }, ({ type, accountUuid }) =>
        withVault(async (vault) => {
          const publicKey = vault.getPublicKey(accountUuid);
          ctx.reply({ type, publicKey });
        })
      )
      .with(
        { type: MessageType.GetNeuterExtendedKey },
        ({ type, derivationPath }) =>
          withVault(async (vault) => {
            const extendedKey = vault.getNeuterExtendedKey(derivationPath);
            ctx.reply({ type, extendedKey });
          })
      )
      .with(
        { type: MessageType.SendRpc },
        ({ type, chainId, method, params }) => {
          handleRpc(chainId, method, params, (response) =>
            ctx.reply({ type, response })
          );
        }
      )
      .otherwise(() => {
        throw new Error("Not Found");
      });
  } catch (err) {
    ctx.replyError(err);
  }
}
