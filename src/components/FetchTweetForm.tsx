import { useState } from "react";
import { useSession } from "next-auth/react";
import SkeletonCard from "src/components/SkeletonCard";
import { TweetWithAuthorProps } from "src/types/common";

import { Avatar, Button, Card, Tooltip, Input } from "react-daisyui";

type FetchTweetFormProps = {
  disabled: boolean;
  onFetchTweet: (fetchedTweet: TweetWithAuthorProps | null) => void;
};

const FetchTweetForm = ({ disabled, onFetchTweet }: FetchTweetFormProps) => {
  const { data: session, status } = useSession();

  const [tweetUrl, setTweetUrl] = useState("");

  const [loadingTweet, setLoadingTweet] = useState(false);
  const [fetchedTweet, setFetchedTweet] = useState<TweetWithAuthorProps | null>(null);

  const handleFetchTweet = async () => {
    setLoadingTweet(true);
    setFetchedTweet(null);

    try {
      if (session) {
        const { token } = session;
        const tweetId = tweetUrl.split("/")[5];

        const response = await fetch("/api/crosspost", {
          method: "POST",
          body: JSON.stringify({ tweetId, token }),
          headers: {
            "Content-type": "application/json",
          },
        });

        const { data, includes } = await response.json();

        const { author_id, edit_history_tweet_ids, id, text } = data;
        const { users } = includes;

        const payload = {
          author_id,
          edit_history_tweet_ids,
          id,
          text,
          users,
        };

        setFetchedTweet(payload);
        onFetchTweet(payload);
      }
    } catch (error) {
      console.warn({ error });
    } finally {
      setLoadingTweet(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTweetUrl(event.target.value);
  };

  const handleClearUrl = () => {
    setTweetUrl("");
    setFetchedTweet(null);
    onFetchTweet(null);
  };

  const getAuthor = (tweet: TweetWithAuthorProps) => {
    const temp = tweet.users?.find(user => user.id === tweet.author_id);

    return {
      temp,
    };
  };

  const formDisabled = !Boolean(session && status === "authenticated");

  return (
    <Card
      id="fetch-tweet-container"
      bordered={false}
      className="rounded-[14px] shadow-md bg-white flex flex-col h-fit">
      <Card.Body className="gap-6">
        <h2 className={`text-lg font-bold ${disabled ? "text-[#A0ADB4]" : "text-neutral"}`}>
          2. Find tweet using URL
        </h2>
        <div className="flex flex-row gap-4">
          <fieldset className="w-full space-y-1 text-neutral">
            <div className="relative">
              <Input
                type="url"
                name="tweet-url"
                id="tweet-url"
                placeholder="Tweet URL"
                disabled={formDisabled}
                value={tweetUrl}
                onChange={handleChange}
                required
                size="md"
                className="py-2 text-sm text-base-100 border rounded-lg border-[#d9d9d9] sm:w-full focus:border-accent bg-white"
              />
            </div>
          </fieldset>
          {!tweetUrl ? (
            <Tooltip message="Please enter tweet URL">
              <Button className="normal-case whitespace-nowrap" disabled onClick={handleFetchTweet}>
                Find tweet
              </Button>
            </Tooltip>
          ) : (
            <Button
              color="accent"
              className={`${
                fetchedTweet || loadingTweet
                  ? "border-1 border-accent text-accent bg-white hover:bg-accent hover:text-white"
                  : "border-none bg-gradient-to-r from-primary to-secondary text-white"
              } rounded-lg normal-case whitespace-nowrap`}
              disabled={loadingTweet}
              onClick={handleFetchTweet}>
              {loadingTweet ? "Fetching..." : "Find tweet"}
            </Button>
          )}
        </div>

        {loadingTweet ? <SkeletonCard /> : <></>}

        {fetchedTweet ? (
          <Card
            key={fetchedTweet.id}
            bordered={false}
            className="border rounded-lg border-[#d9d9d9] bg-white py-2 h-fit">
            <Card.Body className="px-6 gap-6">
              <div className="flex flex-row items-center self-start justify-center gap-2">
                <Avatar
                  src={getAuthor(fetchedTweet).temp?.profile_image_url ?? ""}
                  shape="circle"
                  size="xs"
                />
                <div>
                  <div className="font-bold text-neutral">{getAuthor(fetchedTweet).temp?.name}</div>
                  <div className="font-normal text-gray-500">
                    {`@${getAuthor(fetchedTweet).temp?.username}`}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start py-2 font-normal text-neutral">
                {fetchedTweet.text}
              </div>
            </Card.Body>
          </Card>
        ) : (
          <></>
        )}
      </Card.Body>
    </Card>
  );
};

export default FetchTweetForm;
