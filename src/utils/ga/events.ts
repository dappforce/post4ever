// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { event } from "nextjs-google-analytics";
import categories from "./categories";
import { useWalletStore } from "src/store";
import { useCallback } from "react";

type CreateEventProps = {
  category: string;
  action: string;
  userId?: string;
};

const sendGaEvent = ({ action, category, userId }: CreateEventProps) => {
  event(action, { category, userId });
};

export const sendGuestGaEvent = (action: string) =>
  sendGaEvent({
    category: categories.user.guest,
    action,
  });

export const sendSignedInGaEvent = (action: string, address?: string) =>
  sendGaEvent({
    category: categories.user.signin,
    action,
    userId: address,
  });

export const useSendGaUserEvent = () => {
  const { address } = useWalletStore(state => ({
    address: state.account?.address,
  }));
  const memoizedSignInGaEvent = useCallback(
    (action: string) => sendSignedInGaEvent(action, address),
    [address],
  );
  const sendGAEvent = address ? memoizedSignInGaEvent : sendGuestGaEvent;

  return sendGAEvent;
};
