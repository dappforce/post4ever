// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { ApiPromise } from "@polkadot/api";
import { SubsocialApi } from "@subsocial/api";
import { DependencyList, EffectCallback, useCallback, useEffect, useState } from "react";
import initializeApi from "src/lib/SubsocialApi";

export default function useSubsocialEffect(
  effect: (subsocialApi: SubsocialApi, substrateApi: ApiPromise) => ReturnType<EffectCallback>,
  deps: DependencyList = [],
) {
  const [subsocialApi, setSubsocialApi] = useState<SubsocialApi | null>(null);
  const [substrateApi, setSubstrateApi] = useState<ApiPromise | null>(null);
  useEffect(() => {
    initializeApi().then(api => {
      setSubsocialApi(api);
      api.substrateApi.then(setSubstrateApi);
    });
  }, []);

  useEffect(() => {
    if (!subsocialApi || !substrateApi) return;
    const cleanup = effect(subsocialApi, substrateApi);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subsocialApi, substrateApi, ...deps]);
}
