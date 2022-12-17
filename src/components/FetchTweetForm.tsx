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
      className="flex h-fit flex-col rounded-[14px] bg-white shadow-md">
      <Card.Body className="gap-4 p-4 md:gap-6 md:p-8">
        <h2 className={`text-lg font-bold ${disabled ? "text-[#A0ADB4]" : "text-neutral"}`}>
          2. Find tweet using URL
        </h2>
        <div className="flex flex-col gap-4">
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
            className="w-full rounded-lg border border-[#d9d9d9] bg-[#FAFBFB] py-2 text-sm focus:border-accent focus:bg-[#FAFBFB]"
          />
          {!tweetUrl ? (
            <Tooltip className="w-full" message="Please enter tweet URL">
              <Button
                className="w-full whitespace-nowrap normal-case"
                disabled
                onClick={handleFetchTweet}>
                Find tweet
              </Button>
            </Tooltip>
          ) : (
            <Button
              className={`${
                fetchedTweet || loadingTweet ? "btn btn-outline btn-accent" : "btn-gradient"
              } w-full whitespace-nowrap rounded-lg`}
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
            className="h-fit rounded-lg border border-[#d9d9d9] bg-white shadow-[0px_4px_+13px_#E1E6E8]">
            <Card.Body className="card-body gap-[14px] px-4 py-5">
              <div className="flex flex-row items-center justify-center gap-2 self-start">
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
