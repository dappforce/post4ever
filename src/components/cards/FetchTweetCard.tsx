import { useMemo, useState } from "react";
import clsx from "clsx";
// import { useSession } from "next-auth/react";
import SkeletonCard from "components/cards/SkeletonCard";
import { TweetWithIncludesProps } from "src/types/common";
import { getAuthor, removeTrailingUrl } from "src/utils/tweet";

import WrapperCard from "./WrapperCard";
import { Avatar, Button, Card, Tooltip } from "react-daisyui";
import { Input } from "@material-tailwind/react";
import TweetBody from "../render/TweetBody";
import { rootInput } from "styles/common";
import { BaseTweetProps } from "src/types/common";
import { urlMatcher } from "src/utils/string";
import { useSendGaUserEvent } from "src/utils/ga/events";

type FetchTweetCardProps = {
  disabled: boolean;
  onFetchTweet: (fetchedTweet: TweetWithIncludesProps | null) => void;
};

const returnRemovedUrlIdx = (firstCondition: boolean, secondCondition: boolean) => {
  if (!firstCondition && !secondCondition) return 0;
  return firstCondition && secondCondition ? -2 : -1;
};

const FetchTweetCard = ({ disabled, onFetchTweet }: FetchTweetCardProps) => {
  const sendGaEvent = useSendGaUserEvent();
  // const { data: session, status } = useSession();

  const [tweetUrl, setTweetUrl] = useState("");
  const [errorInput, setErrorInput] = useState(false);

  const [loadingTweet, setLoadingTweet] = useState(false);
  const [fetchedTweet, setFetchedTweet] = useState<TweetWithIncludesProps | null>(null);

  const tweetAuthor = useMemo(() => {
    if (!fetchedTweet) return null;

    return getAuthor(fetchedTweet);
  }, [fetchedTweet]);

  const handleFetchTweet = async () => {
    sendGaEvent("Click on find tweet button");
    setLoadingTweet(true);
    setFetchedTweet(null);

    try {
      const [tweetWithoutUrl] = tweetUrl.split("?");
      const tweetId = tweetWithoutUrl.split("/")[5];

      const response = await fetch(`/api/crosspost?tweetId=${tweetId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      const { data, includes } = await response.json();
      const { text } = data;
      const { users, media, tweets } = includes;

      let isAnyMedia = false;
      let isAnyReferencedTweet = false;

      if (tweets) {
        isAnyReferencedTweet = tweets.some((tweet: BaseTweetProps) => tweet.hasOwnProperty("id"));
      }
      if (media && media.length) isAnyMedia = true;

      let processedText = text;
      const numOfRemovedUrl = returnRemovedUrlIdx(isAnyMedia, isAnyReferencedTweet);
      if (numOfRemovedUrl > 0) {
        processedText = removeTrailingUrl(
          text,
          returnRemovedUrlIdx(isAnyMedia, isAnyReferencedTweet),
        );
      }

      const payload = {
        ...data,
        text: processedText,
        users,
        media,
        tweets,
      };

      setFetchedTweet(payload);
      onFetchTweet(payload);
    } catch (error) {
      alert((error as any).message);
      console.warn({ error });
    } finally {
      setLoadingTweet(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    handleValidateUrl(text as string);
    setTweetUrl(text);
  };

  const handleValidateUrl = (text: string) => {
    if (typeof text === "string") {
      const isMatched = urlMatcher(text, "https://twitter.com/");

      if (!isMatched) {
        setErrorInput(true);
      }
      if ((!isMatched && text.length === 0) || isMatched || text.length === 0) setErrorInput(false);
    }
  };

  const isTweetFetched = Boolean(fetchedTweet);

  // const formDisabled = !Boolean(session && status === "authenticated");

  return (
    <WrapperCard id={"fetch-tweet-form-card"}>
      <h2 className={clsx("text-lg font-bold text-neutral", { "text-disabled-gray": disabled })}>
        {`1. Find a tweet using URL ${isTweetFetched ? "✅" : ""}`}
      </h2>
      <div id="input-tweet-url-root" className={rootInput}>
        <div className="flex flex-col gap-1">
          <Input
            label="Tweet URL"
            value={tweetUrl}
            // disabled={formDisabled}
            disabled={disabled}
            onChange={handleChange}
            error={errorInput}
            className={clsx("!rounded-lg bg-[#FAFBFB]", { "cursor-not-allowed": disabled })}
          />
          {errorInput && (
            <label className="text-xs text-[#f44336]">
              Invalid link, please enter the link to a tweet on Twitter.
            </label>
          )}
        </div>
        {!tweetUrl || errorInput ? (
          <Tooltip className="w-full cursor-not-allowed" message="Please enter tweet URL">
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
              "btn-outline btn-accent btn": fetchedTweet || loadingTweet,
              "cursor-not-allowed": disabled,
            })}
            disabled={errorInput || loadingTweet}
            onClick={handleFetchTweet}>
            {loadingTweet ? "Fetching..." : "Find tweet"}
          </Button>
        )}
      </div>
      {loadingTweet ? <SkeletonCard /> : <></>}

      {fetchedTweet && JSON.stringify(fetchedTweet)}
      {/* {fetchedTweet ? (
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
            <div className="flex flex-col items-start pt-2 font-normal text-neutral">
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
      ) : null} */}
    </WrapperCard>
  );
};

export default FetchTweetCard;
