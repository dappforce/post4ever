import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { authOptions } from "pages/api/auth/[...nextauth]";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useEffect, useState } from "react";
import { ExpandedTweetProps } from "src/types/common";
import { TwitterApi } from "twitter-api-v2";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AuthButton from "src/components/Button";
import { unstable_getServerSession } from "next-auth/next";
import Image from "next/image";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { TweetsProps, TweetProps, PostProps } from "src/types/common";
const Appbar = dynamic(() => import("src/components/Appbar"), {
  ssr: false,
});

const TweetPage: NextPage<TweetsProps> = ({ tweets }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { initApi, loading, postTransaction } = useSubSocialApiHook();
  const [savedPosts, setSavedPosts] = useState<PostProps[]>([]);

  const IS_ABOVE_LIMIT = Boolean(savedPosts.length > 5);

  useEffect(() => {
    if (savedPosts.length > 0 && session) {
      initApi({ mnemonic: session.mnemonic });
    }
  }, [savedPosts.length, session]);

  if (status === "loading") return <FullScreenLoading />;

  if (status === "unauthenticated")
    return (
      <div>
        <p>Access unauthorized, please login first</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/")}
        >
          Go back to login
        </button>
      </div>
    );

  if (!session) return null;

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      let selectedTweet = tweets.filter(
        (tweet: TweetProps) => tweet.id === e.target.value
      )[0];

      setSavedPosts((oldArray) => [...oldArray, selectedTweet]);
    } else {
      setSavedPosts(
        savedPosts.filter((savedPost) => savedPost.id !== e.target.value)
      );
    }
  };

  const handlePostTransaction = () => {
    const { mnemonic } = session;

    postTransaction({
      savedPosts,
      mnemonic,
    });
  };

  return (
    <>
      <Head>
        <title>Perma-Tweeter - Home</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Appbar>
        <div className="flex flex-row items-center justify-center max-w-full max-h-screen">
          <div className="flex flex-col self-start mt-4 p-4 gap-2 max-w-[500px]">
            <AuthButton text={"Logout"} />
            <a>{`Welcome! You are logged in as @${session.user.name}`}</a>
          </div>
          <div className="flex flex-row max-h-screen p-4">
            <div className="flex flex-col overflow-y-auto overflow-x-hidden">
              {tweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className="p-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-500 dark:hover:bg-blue-500
                flex flex-col items-center mb-4"
                >
                  <div className="flex flex-row items-center self-start justify-center gap-2">
                    <Image
                      src={session.user?.image ?? ""}
                      alt="user-avatar"
                      className="rounded-full"
                      width="32"
                      height="32"
                    />
                    <div>{session?.user?.name ?? "Twitter user"}</div>
                  </div>
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
          <div className="flex flex-col self-start items-center justify-center mt-4 p-4 gap-2 max-w-[500px]">
            <button
              className="bg-blue-500 disabled:bg-gray-300 disabled:hover:bg-gray-100 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handlePostTransaction}
              disabled={
                savedPosts.length === 0 || savedPosts.length > 2 ? true : false
              }
            >
              {`Send ${
                savedPosts.length === 0 ? "0" : savedPosts.length
              } post(s) to Subsocial!`}
            </button>
            <a>{loading ? "Sending tx, open your console" : ""}</a>
            <a>
              {savedPosts.length > 2
                ? "Max 2 posts to be saved!"
                : "Select tweets to be saved"}
            </a>
          </div>
        </div>
      </Appbar>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { token } = session;

  if (!token) throw new Error("Token not defined!");

  const twitterClient = new TwitterApi(token);

  // Tell typescript it's a readonly app
  const readOnlyClient = twitterClient.readOnly;

  // get TweetUserTimelineV2Paginator
  const { id } = session?.user;
  const myTimeline = await readOnlyClient.v2.userTimeline(id, {
    exclude: "replies",
    expansions: ["attachments.media_keys"],
    "media.fields": ["url"],
  });

  const user = await readOnlyClient.v2.user(id);

  let tweets = [];

  for await (const tweet of myTimeline) {
    const medias = myTimeline.includes.medias(tweet);

    let tweetObj: ExpandedTweetProps = {
      ...tweet,
      url: `https://twitter.com/${user.data.username}/status/${tweet.id}`,
    };

    if (medias.length) {
      tweetObj = {
        ...tweet,
        medias,
        url: `https://twitter.com/${user.data.username}/status/${tweet.id}`,
      };
    }

    tweets.push(tweetObj);
  }

  return {
    props: { tweets },
  };
}

export default TweetPage;
