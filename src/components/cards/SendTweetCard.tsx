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
import useMyBalance from "src/hooks/use-my-balance";

type SendTweetCardProps = {
  disabled: boolean;
  fetchedTweet: TweetWithIncludesProps | null;
  onSuccess: (props: SuccessPayloadProps) => void;
};

const SendTweetCard = ({ disabled, fetchedTweet, onSuccess }: SendTweetCardProps) => {
  const {
    loadingSpaces,
    loadingCreatePost,
    spaces,
    createSpaceWithTweet,
    createPostWithSpaceId,
    checkSpaceOwnedBy,
  } = useSubSocialApiHook();
  const { hasToken } = useMyBalance();
  const { account } = useWalletStore(state => ({
    account: state.account,
  }));

  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSpaceId(null);
    if (account) {
      checkSpaceOwnedBy(account);
    }
  }, [account]);

  const BUTTON_TEXT = "Publish to Subsocial";

  const handleChangeSpaceId = (value?: React.ReactNode) => {
    const spaceId = value as string;
    if (spaceId) {
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
      createPostWithSpaceId({
        account,
        content: fetchedTweet,
        spaceId: selectedSpaceId,
        successCallback: onSuccess,
      });
    }
  };

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
          ) : spaces ? (
            <Select
              label="Space"
              disabled={disabled}
              onChange={value => handleChangeSpaceId(value)}
              className={clsx("!rounded-lg bg-[#FAFBFB]", {
                "cursor-not-allowed": disabled,
              })}>
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

        {!hasToken && !disabled && <EnergyAlert />}

        {!account || !fetchedTweet || !selectedSpaceId ? (
          <Tooltip
            className="cursor-not-allowed"
            message={
              !account
                ? "Please connect wallet first"
                : !fetchedTweet
                ? "Please find a tweet first"
                : "Please connect wallet with space first"
            }>
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
