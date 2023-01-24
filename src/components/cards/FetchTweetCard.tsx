import { useMemo, useState } from "react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import SkeletonCard from "components/cards/SkeletonCard";
import { TweetWithAuthorProps } from "src/types/common";
import { getAuthor } from "src/utils/tweet";

import WrapperCard from "./WrapperCard";
import { Avatar, Button, Card, Tooltip, Input } from "react-daisyui";
import TweetBody from "../render/TweetBody";
import { rootInput } from "styles/common";

type FetchTweetCardProps = {
  disabled: boolean;
  onFetchTweet: (fetchedTweet: TweetWithAuthorProps | null) => void;
};

const FetchTweetCard = ({ disabled, onFetchTweet }: FetchTweetCardProps) => {
  const { data: session, status } = useSession();

  const [tweetUrl, setTweetUrl] = useState("");

  const [loadingTweet, setLoadingTweet] = useState(false);
  const [fetchedTweet, setFetchedTweet] = useState<TweetWithAuthorProps | null>(null);

  const tweetAuthor = useMemo(() => {
    if (!fetchedTweet) return null;

    return getAuthor(fetchedTweet);
  }, [fetchedTweet]);

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
        const { users, media } = includes;

        const payload = {
          author_id,
          edit_history_tweet_ids,
          id,
          text,
          users,
          media,
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

  const formDisabled = !Boolean(session && status === "authenticated");

  return (
    <WrapperCard id={"fetch-tweet-form-card"}>
      <h2
        className={clsx("text-lg font-bold text-neutral", {
          "text-disabled-gray": disabled,
        })}>
        2. Find a tweet using URL
      </h2>
      <div id="input-tweet-url-root" className={rootInput}>
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
          className="w-full rounded-lg border border-light-gray bg-[#FAFBFB] py-2 text-sm focus:border-accent focus:bg-[#FAFBFB]"
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
            className={clsx({
              "btn-gradient w-full whitespace-nowrap rounded-lg": !fetchedTweet,
              "btn-outline btn-accent btn": fetchedTweet,
            })}
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
          className="h-fit rounded-lg border border-dark-gray bg-white shadow-[0px_4px_+13px_#E1E6E8]">
          <Card.Body className="card-body gap-[14px] px-4 py-5">
            <div className="flex flex-row items-center justify-center gap-2 self-start">
              <Avatar src={tweetAuthor?.profile_image_url ?? ""} shape="circle" size="xs" />
              <div>
                <div className="font-bold text-neutral">{tweetAuthor?.name ?? "Unknown name"}</div>
                <div className="font-normal text-gray-500">
                  {`@${tweetAuthor?.username ?? "Unknown username"}`}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start py-2 font-normal text-neutral">
              <TweetBody text={fetchedTweet.text} />
            </div>
            {fetchedTweet.media ? (
              <div className="twitter-image-container">
                <img
                  src={fetchedTweet.media && fetchedTweet.media[0].url}
                  alt="tweet-media"
                  className="twitter-image"
                />
              </div>
            ) : null}
          </Card.Body>
        </Card>
      ) : null}
    </WrapperCard>
  );
};

export default FetchTweetCard;
