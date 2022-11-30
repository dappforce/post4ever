import type { NextPage, GetServerSidePropsContext } from "next";
import type { SpaceData } from "@subsocial/api/types";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { authOptions } from "pages/api/auth/[...nextauth]";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTwitterUserStore, useWalletStore } from "src/store";
import { unstable_getServerSession } from "next-auth/next";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { TweetWithAuthorProps } from "src/types/common";
import TwitterUserProfileCard from "components/TwitterUserProfileCard";
import { TwitterApi } from "twitter-api-v2";
import { AuthenticatedPageProps } from "src/types/common";
import { Card } from "react-daisyui";
const Layout = dynamic(() => import("src/components/Layout"), {
  ssr: false,
});

const CrossPostPage: NextPage = ({ user }: Partial<AuthenticatedPageProps>) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    initApi,
    checkSpaceOwnedBy,
    loadingSpaces,
    loadingCreatePost,
    spaces,
    createSpaceWithTweet,
    createPostWithSpaceId,
  } = useSubSocialApiHook();
  const { account } = useWalletStore(state => ({
    account: state.account,
  }));

  const { user: authenticatedUser, setNewUser } = useTwitterUserStore(state => ({
    user: state.user,
    setNewUser: state.setNewUser,
  }));

  useEffect(() => {
    if (user) {
      setNewUser({
        ...user,
      });
    }
  }, [user]);

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

  const [tweetUrl, setTweetUrl] = useState("");
  const [loadingTweet, setLoadingTweet] = useState(false);
  const [fetchedTweet, setFetchedTweet] = useState<TweetWithAuthorProps | null>(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState("");

  if (status === "loading") return <FullScreenLoading />;

  if (status === "unauthenticated")
    return (
      <div>
        <p>Access unauthorized, please login first</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/")}>
          Go back to login
        </button>
      </div>
    );

  if (!session) return null;

  const handleFetchTweet = async () => {
    setLoadingTweet(true);

    try {
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
  };

  const getAuthor = (tweet: TweetWithAuthorProps) => {
    const temp = tweet.users?.find(user => user.id === tweet.author_id);

    return {
      temp,
    };
  };

  const handleFetchSpaces = () => {
    checkSpaceOwnedBy(account!);
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

  const handleToggleSelect = (space: SpaceData) => {
    if (selectedSpaceId === space.id) {
      setSelectedSpaceId("");
    } else {
      setSelectedSpaceId(space.id);
    }
  };

  return (
    <>
      <Head>
        <title>Perma-Tweeter - Cross-post Tweet</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="grid grid-cols-[0.75fr_1.5fr_1.5fr] px-4 max-w-full h-screen">
          <TwitterUserProfileCard authenticatedUser={authenticatedUser} />

          <Card
            id="fetch-tweet-container"
            bordered={false}
            className="shadow-2xl bg-white m-4 flex flex-col p-4 gap-2 h-fit">
            <h2 className="text-lg font-bold">1. Find tweet using URL</h2>
            {fetchedTweet ? (
              <div
                key={fetchedTweet.id}
                className="p-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-blue-500 dark:hover:bg-blue-500
                flex flex-col items-center mb-4">
                <div className="flex flex-row items-center self-start justify-center gap-2">
                  <Image
                    src={getAuthor(fetchedTweet).temp?.profile_image_url ?? ""}
                    alt="user-avatar"
                    className="rounded-full"
                    width="32"
                    height="32"
                  />
                  <div>
                    <div>{getAuthor(fetchedTweet).temp?.name ?? "Twitter user"}</div>
                    <div>{`@${getAuthor(fetchedTweet).temp?.username}` ?? "@username"}</div>
                  </div>
                </div>
                <div className="flex flex-col items-start py-2 px-4">{fetchedTweet.text}</div>
              </div>
            ) : (
              <></>
            )}
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tweet URL
            </label>
            <input
              type="text"
              id="tweet-url"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="https://twitter.com/cat_auras/status/1592442883424276486"
              value={tweetUrl}
              onChange={handleChange}
              required
            />
            <div className="flex flex-row gap-2 mt-2">
              <button
                className="disabled:bg-gray-500 disabled:hover:bg-gray-700 text-red font-bold py-2 px-4 rounded"
                disabled={!tweetUrl}
                onClick={handleClearUrl}>
                Clear URL
              </button>
              <button
                className="bg-blue-500 disabled:bg-gray-500 disabled:hover:bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loadingTweet || !tweetUrl}
                onClick={handleFetchTweet}>
                {loadingTweet ? "Fetching tweet..." : "Find tweet"}
              </button>
            </div>
          </Card>

          <Card
            bordered={false}
            className="shadow-2xl m-4 bg-white flex flex-col self-start items-center justify-center p-4 gap-2">
            <h2 className="text-lg font-bold">2. Connect your wallet and select a space</h2>
            <p>Space you owned: {spaces ? "" : "0"}</p>
            <div>
              {spaces?.map(space => (
                <button
                  className={`${
                    selectedSpaceId === space.id
                      ? "bg-blue-600 border border-blue-300 font-bold"
                      : ""
                  } rounded border-2 border-gray-700 p-2`}
                  key={space.id}
                  onClick={() => handleToggleSelect(space)}>
                  Space ID: {space.id}
                </button>
              ))}
            </div>
            <button
              className="bg-blue-500 disabled:bg-gray-500 disabled:hover:bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={Boolean(!account)}
              onClick={handleFetchSpaces}>
              {loadingSpaces ? "Loading" : "Find my space(s)"}
            </button>
            {!spaces ? (
              <button
                className="bg-blue-500 disabled:bg-gray-500 disabled:hover:bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={!spaces && Boolean(!account) && Boolean(!fetchedTweet)}
                onClick={handleCreateSpaceWithTweet}>
                Create space with tweet
              </button>
            ) : (
              <></>
            )}
            <div className="group relative inline-block">
              <div>
                <button
                  className="bg-blue-500 disabled:bg-gray-500 disabled:hover:bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={!fetchedTweet || !selectedSpaceId || loadingCreatePost}
                  onClick={handleCreatePostWithSpaceId}>
                  {loadingCreatePost ? "Sending, sign and open console" : "Send post to Subsocial!"}
                </button>
              </div>

              {!fetchedTweet ? (
                <div className="absolute top-full left-1/2 z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded text-red-500 bg-gray-700 py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100">
                  <span className="absolute top-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm text-red-500 bg-gray-700"></span>
                  Find tweet to be sent first
                </div>
              ) : (
                <></>
              )}
            </div>
          </Card>
        </div>
      </Layout>
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

  const { id } = session?.user;
  const { data: user } = await readOnlyClient.v2.user(id, {
    "user.fields": ["id", "name", "profile_image_url"],
  });

  return {
    props: { user },
  };
}

export default CrossPostPage;
