import { useCallback, useEffect, useState } from "react";
import { useWalletStore } from "src/store";
import useSubsocialEffect from "./use-subsocial-effect";
import { ApiPromise } from "@polkadot/api";
import BN from "bn.js";

export default function useMyBalance() {
  const { address } = useWalletStore(state => ({
    address: state.account?.address.toString(),
  }));
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [energy, setEnergy] = useState<string | undefined>(undefined);

  const subscribeBalanceAndEnergy = useCallback((substrateApi: ApiPromise, address: string) => {
    let unsubBalanceAndEnergy: () => void = () => undefined;
    if (!substrateApi) return undefined;

    const unsubBalancePromise = substrateApi.derive.balances.all(address, ({ freeBalance }) => {
      setBalance(freeBalance.toString());
    });
    const unsubEnergyPromise = substrateApi.query.energy.energyBalance(address, energyBalance => {
      setEnergy(energyBalance.toString());
    });
    unsubBalanceAndEnergy = () => {
      unsubBalancePromise
        .then(unsub => unsub())
        .catch(e => console.warn("Error while subscribing to balance", e));
      unsubEnergyPromise
        .then(unsub => unsub())
        .catch(e => console.warn("Error while subscribing to energy", e));
    };
    return unsubBalanceAndEnergy;
  }, []);

  useSubsocialEffect(
    (_, substrateApi) => {
      const unsub = subscribeBalanceAndEnergy(substrateApi, address ?? "");
      return unsub;
    },
    [subscribeBalanceAndEnergy, address],
  );

  useEffect(() => {
    if (!address) return;
  }, [address]);

  const isBalanceZero = new BN(balance || 0).isZero();
  const isEnergyZero = new BN(energy || 0).isZero();
  return {
    balance,
    energy,
    hasToken: !isBalanceZero && !isEnergyZero,
  };
}
