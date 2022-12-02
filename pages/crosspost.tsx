import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Head from "next/head";
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
import { Avatar, Button, Card, Tooltip, Input } from "react-daisyui";
import { XCircleIcon } from "@heroicons/react/20/solid";
import SkeletonCard from "src/components/SkeletonCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast, { Toaster } from "react-hot-toast";

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
    successTx,
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

  useEffect(() => {
    if (successTx) {
      toast.custom(
        <div className="flex justify-center items-center gap-2 bg-white color-[#363636] text-black min-w-[300px] leading-normal will-change-transform shadow-lg pointer-events-auto py-[8px] px-[10px] rounded-lg">
          ✅{" "}
          <div className="m-auto">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://polkadot.js.org/apps/?rpc=wss://rco-para.subsocial.network#/explorer/query/${successTx}`}>
              Tx succesful!
            </a>{" "}
          </div>
        </div>,
      );
    }
  }, [successTx]);

  const [tweetUrl, setTweetUrl] = useState("");
  const [loadingTweet, setLoadingTweet] = useState(false);
  const [fetchedTweet, setFetchedTweet] = useState<TweetWithAuthorProps | null>(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState(
    spaces && spaces.length ? spaces[0].id : "",
  );

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
    setFetchedTweet(null);

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
    setFetchedTweet(null);
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

  const handleChangeSpaceId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const spaceId = event.currentTarget.value;
    setSelectedSpaceId(spaceId);
  };

  return (
    <>
      <Head>
        <title>Perma-Tweeter - Cross-post Tweet</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="grid grid-cols-[0.5fr_1fr_0.5fr] px-4 max-w-full h-screen">
          <Toaster position="bottom-right" />
          <div></div>
          <div className="flex flex-col mt-4 gap-4">
            <TwitterUserProfileCard authenticatedUser={authenticatedUser} />

            <Card
              id="fetch-tweet-container"
              bordered={false}
              className="shadow-2xl bg-white flex flex-col gap-2 h-fit">
              <Card.Body>
                <h2 className="text-lg font-bold text-base-100">2. Find tweet using URL</h2>
                <div className="flex flex-row gap-4">
                  <fieldset className="w-full space-y-1 text-base-100">
                    <div className="relative">
                      <Input
                        type="url"
                        name="tweet-url"
                        id="tweet-url"
                        placeholder="Tweet URL"
                        value={tweetUrl}
                        onChange={handleChange}
                        required
                        size="md"
                        className="py-2 text-sm text-base-100 rounded-md sm:w-full focus:outline-none focus:border-primary bg-white"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center">
                        <Button
                          onClick={handleClearUrl}
                          shape="circle"
                          className="btn btn-ghost hover:bg-transparent disabled:bg-transparent"
                          disabled={!tweetUrl}>
                          <XCircleIcon
                            className={`${tweetUrl ? "text-red-700" : "text-gray-500"} h-6 w-6`}
                          />
                        </Button>
                      </span>
                    </div>
                  </fieldset>
                  {!tweetUrl ? (
                    <Tooltip message="Please enter tweet URL">
                      <Button
                        color="primary"
                        className="normal-case whitespace-nowrap disabled:text-white"
                        disabled
                        onClick={handleFetchTweet}>
                        Find tweet
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      color="primary"
                      className="normal-case whitespace-nowrap"
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
                    className="drop-shadow-xl bg-white py-2 mt-4 h-fit">
                    <Card.Body className="px-6">
                      <div className="flex flex-row items-center self-start justify-center gap-2">
                        <Avatar
                          src={getAuthor(fetchedTweet).temp?.profile_image_url ?? ""}
                          shape="circle"
                          size="xs"
                        />
                        <div>
                          <div className="font-bold text-base-100">
                            {getAuthor(fetchedTweet).temp?.name}
                          </div>
                          <div className="font-normal text-gray-500">
                            {`@${getAuthor(fetchedTweet).temp?.username}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start py-2 px-4 font-normal text-base-100">
                        {fetchedTweet.text}
                      </div>
                    </Card.Body>
                  </Card>
                ) : (
                  <></>
                )}
              </Card.Body>
            </Card>

            <Card
              bordered={false}
              className="shadow-2xl bg-white flex flex-col self-center items-center justify-center gap-2">
              <Card.Body>
                <h2 className="text-lg font-bold text-base-100">
                  3. Connect wallet and select a SS space
                </h2>

                <p>Select your Subsocial space:</p>
                <div>
                  {loadingSpaces ? (
                    <Skeleton />
                  ) : spaces ? (
                    <select
                      value={selectedSpaceId}
                      onChange={handleChangeSpaceId}
                      color="primary"
                      className="select select-primary bg-transparent w-full">
                      <option value={""} disabled selected>
                        Select your Subsocial space
                      </option>
                      <>
                        {spaces.map(space => (
                          <option key={space.id} value={space.id}>
                            Space ID: {space.id}
                          </option>
                        ))}
                      </>
                    </select>
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
          </div>
          <div></div>
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
