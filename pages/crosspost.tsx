import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { TweetWithAuthorProps } from "src/types/common";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useWalletStore } from "src/store";
import { unstable_getServerSession } from "next-auth/next";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import TwitterUserProfileCard from "components/TwitterUserProfileCard";
import { TwitterApi } from "twitter-api-v2";
import { AuthenticatedPageProps } from "src/types/common";
import FetchTweetForm from "src/components/FetchTweetForm";
import SendTweetCard from "src/components/SendTweetCard";
import toast, { Toaster } from "react-hot-toast";

const Layout = dynamic(() => import("src/components/Layout"), {
  ssr: false,
});

const CrossPostPage: NextPage = ({ user }: Partial<AuthenticatedPageProps>) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { initApi, checkSpaceOwnedBy, createPostWithSpaceId, successTx } = useSubSocialApiHook();
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

  const [fetchedTweet, setFetchedTweet] = useState<TweetWithAuthorProps | null>(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  if (status === "loading") return <FullScreenLoading />;

  const handleSetFetchedTweet = (fetchedTweet: TweetWithAuthorProps) => {
    setFetchedTweet(fetchedTweet);
  };

  return (
    <>
      <Head>
        <title>SubTweet - Cross-post Tweet</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="grid grid-cols-[0.5fr_1fr_0.5fr] px-4 max-w-full h-screen">
          <Toaster position="bottom-right" />
          <div></div>
          <div className="flex flex-col mt-4 gap-4">
            <TwitterUserProfileCard disabled={Boolean(!account)} authenticatedUser={user} />

            <FetchTweetForm
              disabled={Boolean(!account) && !Boolean(user)}
              onFetchTweet={handleSetFetchedTweet}
            />

            <SendTweetCard
              disabled={Boolean(!account) && !Boolean(fetchedTweet)}
              fetchedTweet={fetchedTweet}
            />
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
      props: {},
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
