import { useEffect, useState } from "react";
import { Button, Card, Tooltip } from "react-daisyui";
import { Select, Option } from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";
import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const {
    initApi,
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
    if (session) {
      initApi({ mnemonic: session.mnemonic });
    }
  }, [session]);

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
      className="rounded-[14px] shadow-md bg-white flex flex-col justify-center">
      <Card.Body className="gap-6">
        <h2 className={`text-lg font-bold ${disabled ? "text-[#A0ADB4]" : "text-neutral"}`}>
          3. Connect wallet and select a SS space
        </h2>

        <p>Select your Subsocial space:</p>
        <div>
          {loadingSpaces ? (
            <Skeleton />
          ) : spaces ? (
            <Select label="Space" onChange={value => handleChangeSpaceId(value)}>
              {spaces.map(space => (
                <Option key={space.id} value={`${space.id}`}>
                  Space ID: {space.id}
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
          <Tooltip message="Please connect Polkadot.js first">
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
            className="normal-case border-0 bg-gradient-to-r from-primary to-secondary"
            disabled={!fetchedTweet || loadingCreatePost}
            onClick={spaces ? handleCreatePostWithSpaceId : handleCreateSpaceWithTweet}>
            {loadingCreatePost ? "Sign and open console" : "Publish"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default SendTweetCard;
