import { useEffect, useState } from "react";
import clsx from "clsx";
import { Button, Card, Tooltip } from "react-daisyui";
import { Select, Option } from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";
import { useWalletStore } from "src/store";
import { TweetWithAuthorProps } from "src/types/common";
import { SUB_IPFS_NODE_URL } from "src/configs/sdk-network-config";

type SendTweetCardProps = {
  disabled: boolean;
  fetchedTweet: TweetWithAuthorProps | null;
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
  const { account } = useWalletStore(state => ({
    account: state.account,
  }));

  useEffect(() => {
    if (account) {
      checkSpaceOwnedBy(account);
    }
  }, [account]);

  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

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
    <Card
      bordered={false}
      className="flex flex-col justify-center rounded-[14px] bg-white shadow-md">
      <Card.Body className="gap-4 p-4 md:gap-6 md:p-8">
        <h2
          className={clsx("text-lg font-bold text-neutral", {
            "text-disabled-gray": disabled,
          })}>
          3. Select a Subsocial Space
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            {loadingSpaces ? (
              <Skeleton />
            ) : spaces ? (
              <Select
                label="Space"
                onChange={value => handleChangeSpaceId(value)}
                className="bg-[#FAFBFB]">
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
              <Select label="Space" value="Select" className="bg-[#FAFBFB]">
                <Option>Empty</Option>
              </Select>
            )}
          </div>

          {!account ? (
            <Tooltip className="h-10" message="Please connect wallet first">
              <Button fullWidth className="normal-case" disabled>
                Publish
              </Button>
            </Tooltip>
          ) : !fetchedTweet ? (
            <Tooltip message="Please find a tweet first">
              <Button fullWidth className="normal-case" disabled>
                Publish
              </Button>
            </Tooltip>
          ) : (
            <Button
              fullWidth
              className={clsx("w-full", {
                "btn btn-disabled loading": loadingCreatePost,
                "btn-gradient": !loadingCreatePost,
              })}
              disabled={!fetchedTweet || loadingCreatePost}
              loading={loadingCreatePost}
              onClick={spaces ? handleCreatePostWithSpaceId : handleCreateSpaceWithTweet}>
              <span>{loadingCreatePost ? "Sign and open console" : "Publish"}</span>
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SendTweetCard;
