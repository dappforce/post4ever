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
import { unstable_getServerSession } from "next-auth/next";
import Image from "next/image";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { AuthenticatedPageProps, TweetProps } from "src/types/common";
import { Button } from "react-daisyui";
import { useWalletStore, useTwitterUserStore } from "src/store";
import TwitterUserProfileCard from "components/TwitterUserProfileCard";

import SkeletonCard from "src/components/SkeletonCard";

type TwitterUserProps = {
  id: string;
  name: string;
  profile_image_url: string;
  username: string;
};

const Layout = dynamic(() => import("components/Layout"), {
  ssr: false,
});

const TweetPage: NextPage<AuthenticatedPageProps> = ({ user }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { account } = useWalletStore(state => ({
    account: state.account,
  }));
  const { user: authenticatedUser, setNewUser } = useTwitterUserStore(state => ({
    user: state.user,
    setNewUser: state.setNewUser,
  }));

  const { initApi, loadingCreatePost, postTransaction } = useSubSocialApiHook();
  const [savedPosts, setSavedPosts] = useState<ExpandedTweetProps[]>([]);

  const [fetchedTweets, setFetchedTweets] = useState<ExpandedTweetProps[]>([]);
  const [loadingTweets, setLoadingTweets] = useState(false);

  useEffect(() => {
    if (savedPosts.length > 0 && session) {
      initApi();
    }
  }, [savedPosts.length, session]);

  const handleFetchTweets = async (user: TwitterUserProps) => {
    setLoadingTweets(true);

    try {
      if (session) {
        const response = await fetch(`/api/tweets/?id=${user?.id}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        const { tweets } = await response.json();

        setFetchedTweets(tweets);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoadingTweets(false);
    }
  };

  useEffect(() => {
    setNewUser({
      ...user,
    });

    handleFetchTweets(user);
  }, [user]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      let selectedTweet =
        fetchedTweets &&
        fetchedTweets.filter((tweet: TweetProps) => tweet.id === e.target.value)[0];

      setSavedPosts(oldArray => [...oldArray, selectedTweet]);
    } else {
      setSavedPosts(savedPosts.filter(savedPost => savedPost.id !== e.target.value));
    }
  };

  const handlePostTransaction = () => {
    if (!account) return null;

    postTransaction({
      savedPosts,
      account,
    });
  };

  if (status === "loading") return <FullScreenLoading />;

  if (status === "unauthenticated")
    return (
      <div>
        <p>Access unauthorized, please login first</p>
        <Button className="normal-case" color="primary" onClick={() => router.push("/")}>
          Go back to login
        </Button>
      </div>
    );

  if (!session) return null;

  return (
    <>
      <Head>
        <title>SubTweet - Home</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="grid h-screen max-w-full grid-cols-[0.75fr_1.8fr_1.2fr] px-4">
          <TwitterUserProfileCard disabled={false} authenticatedUser={authenticatedUser} />
          <div className="flex max-h-screen flex-row p-4">
            <div className="flex flex-col overflow-y-auto overflow-x-hidden">
              {loadingTweets && <SkeletonCard />}
              {fetchedTweets &&
                fetchedTweets.map(tweet => (
                  <div
                    key={tweet.id}
                    className="mb-4 flex max-w-lg flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow-md
                hover:bg-gray-100 dark:border-blue-500 dark:bg-gray-800 dark:hover:bg-blue-500">
                    <div className="flex flex-row items-center justify-center gap-2 self-start">
                      <Image
                        src={session.user?.image ?? ""}
                        alt="user-avatar"
                        className="rounded-full"
                        width="32"
                        height="32"
                      />
                      <div>{session?.user?.name ?? "Twitter user"}</div>
                    </div>
                    <div className="flex flex-col items-start py-2 px-4">{tweet.text}</div>
                    <div className="flex items-center">
                      <input
                        id="select-check-box"
                        type="checkbox"
                        value={tweet.id}
                        onChange={handleSelect}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Select this tweet!
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-4 flex max-w-[500px] flex-col items-center justify-center gap-2 self-start p-4">
            <button
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:hover:bg-gray-100"
              onClick={handlePostTransaction}
              disabled={savedPosts.length === 0 || savedPosts.length > 2 ? true : false}>
              {`Send ${savedPosts.length === 0 ? "0" : savedPosts.length} post(s) to Subsocial!`}
            </button>
            <a>{loadingCreatePost ? "Sending tx, open your console" : ""}</a>
            <a>
              {savedPosts.length > 2 ? "Max 2 posts to be saved!" : "Select tweets to be saved"}
            </a>
          </div>
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

  // get TweetUserTimelineV2Paginator
  const { id } = session?.user;

  const { data: user } = await readOnlyClient.v2.user(id, {
    "user.fields": ["id", "name", "profile_image_url"],
  });

  return {
    props: { user },
  };
}

export default TweetPage;
