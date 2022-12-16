import { useEffect, useState } from "react";
import { Button, Card, Tooltip } from "react-daisyui";
import { Select, Option } from "@material-tailwind/react";
import Identicon from "./Identicon";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";
import { useWalletStore } from "src/store";
import { TweetWithAuthorProps } from "src/types/common";

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

  // Need to show avatar stored in subsocial ipfs node
  const SUB_IPFS_NODE_URL = "https://ipfs.subsocial.network/ipfs";

  return (
    <Card
      bordered={false}
      className="rounded-[14px] shadow-md bg-white flex flex-col justify-center">
      <Card.Body className="gap-6">
        <h2 className={`text-lg font-bold ${disabled ? "text-[#A0ADB4]" : "text-neutral"}`}>
          3. Select a Subsocial Space
        </h2>

        <div className="flex flex-col gap-6">
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
                        <div className="w-6 rounded-full">
                          {space.content?.image ? (
                            <img
                              src={`${SUB_IPFS_NODE_URL}/${space.content.image}`}
                              alt="space-avatar"
                              loading="lazy"
                            />
                          ) : (
                            <Identicon size={24} />
                          )}
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
            <Tooltip className="h-10" message="Please connect Polkadot.js first">
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
              className={`normal-case border-0 ${
                loadingCreatePost
                  ? "loading btn-disabled"
                  : "bg-gradient-to-r from-primary to-secondary"
              }`}
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
