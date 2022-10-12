import type { NextPage } from "next";
import { useState } from "react";
import { TwitterApi } from "twitter-api-v2";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

type PostProps = {
  id: string;
  image?: string;
  tags?: string[];
  body?: string;
};

type TweetProps = {
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
};

type TweetsProps = {
  tweets: TweetProps[];
};

const TweetPage: NextPage<TweetsProps> = ({ tweets }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [savedPosts, setSavedPosts] = useState<PostProps[]>([]);

  console.log({ savedPosts });

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated")
    return (
      <div>
        <p>Access unauthorized, please login first</p>
        <button onClick={() => router.push("/")}>Go back to login</button>
      </div>
    );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const selectedTweet = tweets.filter(
        (tweet: TweetProps) => tweet.id === e.target.value
      )[0];

      setSavedPosts((oldArray) => [...oldArray, selectedTweet]);
    } else {
      setSavedPosts(
        savedPosts.filter((savedPost) => savedPost.id !== e.target.value)
      );
    }
  };

  if (!session) return null;

  return (
    <div className="flex flex-row items-center justify-center max-w-full max-h-screen">
      <div>
        <div>{session?.user?.name ?? "Twitter user"}</div>
        <Image
          src={session.user?.image ?? ""}
          alt="user-avatar"
          width="32"
          height="32"
        />
        <button
          onClick={() =>
            signOut({
              callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}`,
            })
          }
        >
          Logout
        </button>
      </div>
      <div className="flex flex-row max-h-screen p-4">
        <div className="flex flex-col overflow-y-auto max-w-[640px]">
          {tweets.map((tweet) => (
            <div
              key={tweet.id}
              className="flex flex-col min-w-full items-center p-4 mb-4 border-2 border-white rounded"
            >
              <div>This is the header</div>
              <div className="flex flex-col items-start py-2 px-4">
                {tweet.text}
              </div>
              <div className="flex items-center">
                <input
                  id="select-check-box"
                  type="checkbox"
                  value={tweet.id}
                  onChange={handleSelect}
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Select this tweet!
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>This is wallet section</div>
    </div>
  );
};

export async function getServerSideProps() {
  //TODO: change token here to get token from session.token
  const token = process.env.TWITTER_BEARER_TOKEN;
  // Instantiate with desired auth type (here's Bearer v2 auth)
  const twitterClient = new TwitterApi(token ?? "");

  // Tell typescript it's a readonly app
  const readOnlyClient = twitterClient.readOnly;

  // get TweetUserTimelineV2Paginator
  // TODO: change id to get from session.user.id
  const id = "435050680";
  const myTimeline = await readOnlyClient.v2.userTimeline(id, {
    exclude: "replies",
  });

  let tweets = [];

  for await (const tweet of myTimeline) {
    tweets.push(tweet);
  }

  return {
    props: { tweets },
  };
}

export default TweetPage;
