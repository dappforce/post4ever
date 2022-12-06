import { useEffect, useState } from "react";
import { Button, Card, Tooltip } from "react-daisyui";
import { Select, Option } from "@material-tailwind/react";
import Skeleton from "react-loading-skeleton";
import { useSession } from "next-auth/react";
import "react-loading-skeleton/dist/skeleton.css";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { useWalletStore } from "src/store";
import { TweetWithAuthorProps } from "src/types/common";

type SendTweetCardProps = {
  disabled: boolean;
  fetchedTweet: TweetWithAuthorProps | null;
};

const SendTweetCard = ({ disabled, fetchedTweet }: SendTweetCardProps) => {
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
      });
    }
  };

  return (
    <Card
      bordered={false}
      className="shadow-md bg-white flex flex-col self-center items-center justify-center">
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
            "No space to be selected"
          )}
        </div>

        {!account ? (
          <Tooltip message="Please connect Polkadot.js first">
            <Button fullWidth className="normal-case disabled:text-white" disabled>
              Send tweet to Subsocial
            </Button>
          </Tooltip>
        ) : !fetchedTweet ? (
          <Tooltip message="Please find a tweet first">
            <Button fullWidth className="normal-case disabled:text-white" disabled>
              Send tweet to Subsocial
            </Button>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            color="primary"
            disabled={!fetchedTweet || loadingCreatePost}
            onClick={spaces ? handleCreatePostWithSpaceId : handleCreateSpaceWithTweet}
            className="normal-case disabled:text-white">
            {loadingCreatePost ? "Sign and open console" : "Send tweet to Subsocial"}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default SendTweetCard;
