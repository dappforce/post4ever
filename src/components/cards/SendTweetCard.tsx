// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

import { useEffect, useState } from "react";
import clsx from "clsx";
import WrapperCard from "./WrapperCard";
import { Button, Tooltip } from "react-daisyui";
import { Select, Option } from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";
import { useWalletStore } from "src/store";
import { TweetWithIncludesProps } from "src/types/common";
import { SUB_IPFS_NODE_URL } from "src/configs/sdk-network-config";
import { rootInput } from "styles/common";
import EnergyAlert from "components/EnergyAlert";
import { useMyBalance } from "src/hooks/use-balance";
import { getP4ESpace } from "src/configs/spaces";
import { useSendGaUserEvent } from "src/utils/ga/events";

type SendTweetCardProps = {
  disabled: boolean;
  fetchedTweet: TweetWithIncludesProps | null;
  onSuccess: (props: SuccessPayloadProps) => void;
};

const SendTweetCard = ({ disabled, fetchedTweet, onSuccess }: SendTweetCardProps) => {
  const sendGaEvent = useSendGaUserEvent();
  const {
    loadingSpaces,
    loadingCreatePost,
    spaces,
    createSpaceWithTweet,
    createPostWithSpaceId,
    checkSpaceOwnedBy,
  } = useSubSocialApiHook();
  const { hasToken } = useMyBalance(true);
  const { account } = useWalletStore(state => ({
    account: state.account,
  }));

  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(getP4ESpace());

  useEffect(() => {
    setSelectedSpaceId(getP4ESpace());
    if (account) {
      checkSpaceOwnedBy(account);
    }
  }, [account]);

  const BUTTON_TEXT = "Publish to Subsocial";

  const handleChangeSpaceId = (value?: React.ReactNode) => {
    const spaceId = value as string;
    if (spaceId) {
      sendGaEvent(`Change space id to ${spaceId}`);
      setSelectedSpaceId(spaceId);
    }
  };

  const handleCreateSpaceWithTweet = () => {
    if (!spaces && account && fetchedTweet) {
      createSpaceWithTweet({ account, content: fetchedTweet });
    }
  };

  const handleCreatePostWithSpaceId = () => {
    if (fetchedTweet && account && selectedSpaceId) {
      sendGaEvent("Click on Publish to Subsocial button");
      createPostWithSpaceId({
        account,
        content: fetchedTweet,
        spaceId: selectedSpaceId,
        successCallback: onSuccess,
      });
    }
  };

  let disabledButtonTooltip = "";
  if (!account) disabledButtonTooltip = "Please connect wallet first";
  else if (!fetchedTweet) disabledButtonTooltip = "Please find a tweet first";
  else if (!hasToken) disabledButtonTooltip = "Please follow the command above to get some energy";
  else if (!selectedSpaceId) disabledButtonTooltip = "Please select a space first";
  else if (loadingSpaces) disabledButtonTooltip = "Loading spaces...";

  return (
    <WrapperCard id={"send-tweet-card"}>
      <h2
        className={clsx("text-lg font-bold text-neutral", {
          "text-disabled-gray": disabled,
        })}>
        2. Select a Subsocial Space
      </h2>

      <div id="input-select-space-root" className={rootInput}>
        <div>
          {loadingSpaces ? (
            <Skeleton className="h-[35px]" />
          ) : spaces && !disabled ? (
            <Select
              key="select-space"
              value={selectedSpaceId ?? undefined}
              label="Space"
              onChange={value => handleChangeSpaceId(value)}
              className={clsx("!rounded-lg bg-[#FAFBFB]")}>
              {spaces.map(space => (
                <Option key={space.id} value={`${space.id}`} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div
                        className={clsx("w-6 rounded-full border border-dark-gray", {
                          "bg-[#E0E0E0]": !space.content?.image,
                        })}>
                        {space.content?.image ? (
                          <img
                            src={`${SUB_IPFS_NODE_URL}/${space.content.image}`}
                            alt="space-avatar"
                            loading="lazy"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div>{space.content?.name ?? "Unnamed space"}</div>
                  </div>
                </Option>
              ))}
            </Select>
          ) : (
            <Select
              disabled
              label="Space"
              value="Select"
              className={clsx("cursor-not-allowed bg-[#FAFBFB]")}>
              <Option>Empty</Option>
            </Select>
          )}
        </div>

        {!hasToken && !disabled && <EnergyAlert address={account?.address ?? ""} />}

        {disabledButtonTooltip ? (
          <Tooltip className="cursor-not-allowed" message={disabledButtonTooltip}>
            <Button fullWidth className="normal-case" disabled>
              {BUTTON_TEXT}
            </Button>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            className={clsx("w-full", {
              "btn-disabled loading btn": loadingCreatePost,
              "btn-gradient": !loadingCreatePost,
              "cursor-not-allowed": disabled,
            })}
            disabled={!fetchedTweet || loadingCreatePost}
            loading={loadingCreatePost}
            onClick={spaces ? handleCreatePostWithSpaceId : handleCreateSpaceWithTweet}>
            <span>{loadingCreatePost ? "Sign and open console" : BUTTON_TEXT}</span>
          </Button>
        )}
      </div>
    </WrapperCard>
  );
};

export default SendTweetCard;
