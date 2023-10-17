import { InpageProtocol } from "core/inpage/protocol";
import { InpageProvider } from "core/inpage/provider";
import { UniversalInpageProvider } from "core/inpage/universalProvider";
import {
  JSONRPC,
  VIGVAM_PHISHING_WARNING,
  VIGVAM_STATE,
} from "core/common/rpc";
import { MetaMaskCompatibleMode } from "core/types/shared";

const inpageProto = new InpageProtocol("injected", "content");
const vigvam = new InpageProvider(inpageProto);

const isMetaMaskModeEnabled = new Promise<boolean>((res) => {
  const unsub = inpageProto.subscribe((payload) => {
    if (payload?.jsonrpc === JSONRPC && payload?.method === VIGVAM_STATE) {
      const metamaskModeEnabled =
        payload.params.mmCompatible !== MetaMaskCompatibleMode.Off;

      res(metamaskModeEnabled);
      unsub();
    }
  });

  // Fallback
  setTimeout(() => {
    res(false);
    unsub();
  }, 3_000);
});

inject1193("ethereum", true);
inject1193("vigvamEthereum");
injectEIP5749("evmproviders");
injectEIP6963();

warnIfPhishing();

// https://eips.ethereum.org/EIPS/eip-1193
function inject1193(key: string, sharedProperty = false) {
  const existing = (window as any)[key];

  if (existing?.isVigvam && "addProviders" in existing) {
    existing.addProviders(vigvam);
    return;
  }

  const propertyDescriptor = Object.getOwnPropertyDescriptor(window, key);
  const redefineProperty =
    !propertyDescriptor || propertyDescriptor.configurable;
  const propIsMetaMaskPreferred = sharedProperty && redefineProperty;

  const universal = new UniversalInpageProvider(
    existing && redefineProperty
      ? [vigvam, ...getProvidersInline(existing)]
      : [vigvam],
    sharedProperty,
    propIsMetaMaskPreferred,
  );

  const defineProperty = () =>
    Object.defineProperty(window, key, {
      configurable: false,
      get() {
        return universal;
      },
      set(value) {
        if (value) universal.addProviders(value);
      },
    });

  if (redefineProperty) {
    if (existing && sharedProperty) {
      isMetaMaskModeEnabled.then((enabled) => {
        if (enabled) defineProperty();
      });
    } else {
      defineProperty();
    }
  } else {
    try {
      (window as any)[key] = universal;
    } catch (err) {
      console.warn(err);
    }
  }

  if (!existing) {
    window.dispatchEvent(new Event(`${key}#initialized`));
  }
}

// https://eips.ethereum.org/EIPS/eip-5749
function injectEIP5749(key: string) {
  const evmProviders: Record<string, InpageProvider> =
    (window as any)[key] || ((window as any)[key] = {});

  evmProviders[vigvam.info.uuid] = vigvam;
}

// https://eips.ethereum.org/EIPS/eip-6963
function injectEIP6963() {
  const announceProvider = () => {
    window.dispatchEvent(
      new CustomEvent("eip6963:announceProvider", {
        detail: Object.freeze({ info: vigvam.info, provider: vigvam }),
      }),
    );
  };

  window.addEventListener("eip6963:requestProvider", announceProvider);

  announceProvider();
}

function getProvidersInline(existing: any) {
  try {
    if (Array.isArray(existing.providers)) {
      return new Set([existing, ...existing.providers]);
    }
  } catch (err) {
    console.warn(err);
  }

  return [existing];
}

function warnIfPhishing() {
  const unsub = inpageProto.subscribe((payload) => {
    if (
      payload?.jsonrpc === JSONRPC &&
      payload?.method === VIGVAM_PHISHING_WARNING
    ) {
      unsub();

      // TODO: Add own warning page
      setTimeout(() => {
        location.replace(
          `https://metamask.github.io/phishing-warning/v2.1.0/#hostname=${location.hostname}&href=${location.href}`,
        );
      }, 50);
    }
  });
}
