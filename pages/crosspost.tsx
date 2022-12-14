import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React, { useCallback, useState, useEffect } from "react";
import Head from "next/head";
import Identicon from "src/components/Identicon";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { TweetWithAuthorProps } from "src/types/common";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useSession } from "next-auth/react";
import { useWalletStore } from "src/store";
import { unstable_getServerSession } from "next-auth/next";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";
import TwitterUserProfileCard from "components/TwitterUserProfileCard";
import { TwitterApi } from "twitter-api-v2";
import { AuthenticatedPageProps } from "src/types/common";
import FetchTweetForm from "src/components/FetchTweetForm";
import SendTweetCard from "src/components/SendTweetCard";
import toast, { Toaster } from "react-hot-toast";
import { Button, Card } from "react-daisyui";

import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

import { trimMiddleString } from "src/utils/string";

const Layout = dynamic(() => import("src/components/Layout"), {
  ssr: false,
});

const CrossPostPage: NextPage = ({ user }: Partial<AuthenticatedPageProps>) => {
  const { status } = useSession();

  const { successTx } = useSubSocialApiHook();
  const { account } = useWalletStore(state => ({
    account: state.account,
  }));

  useEffect(() => {
    if (successTx) {
      toast.custom(
        <div className="flex justify-center items-center gap-2 bg-white color-[#363636] text-black min-w-[300px] leading-normal will-change-transform shadow pointer-events-auto py-[8px] px-[10px] rounded-lg">
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

  const handleSetFetchedTweet = (fetchedTweet: TweetWithAuthorProps | null) => {
    setFetchedTweet(fetchedTweet);
  };

  const [contentId, setContentId] = useState<SuccessPayloadProps | undefined>();

  const handleSuccessSendTweet = useCallback(({ spaceId, postId }: SuccessPayloadProps) => {
    setContentId({
      postId,
      spaceId,
    });
  }, []);

  if (status === "loading") return <FullScreenLoading />;

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
            <TwitterUserProfileCard
              disabled={!Boolean(account) || Boolean(user)}
              authenticatedUser={user}
            />

            <FetchTweetForm
              disabled={!Boolean(user) || Boolean(fetchedTweet)}
              onFetchTweet={handleSetFetchedTweet}
            />

            <SendTweetCard
              disabled={(!Boolean(account) && !Boolean(user)) || !Boolean(fetchedTweet)}
              fetchedTweet={fetchedTweet}
              onSuccess={handleSuccessSendTweet}
            />
          </div>
          <div></div>
        </div>

        <Dialog
          open={Boolean(contentId)}
          handler={() => setContentId(undefined)}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.5, y: 50 },
          }}
          className="w-auto min-w-min max-w-[520px] p-8 rounded-2xl backdrop-blur-[1px]">
          <DialogHeader className="flex flex-col justify-center items-center gap-2 p-0">
            <div className="font-bold text-2xl leading-7 text-[#222222] px-0 flex flex-row w-full justify-end items-center">
              <div className="ml-auto">🎉 Tweet published</div>
              <button onClick={() => setContentId(undefined)} className="ml-auto">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                    fill="#888888"
                  />
                </svg>
              </button>
            </div>
            <div className="font-normal text-base leading-[140%] text-[#888888]">
              Tweet successfully saved to the blockchain!
            </div>
          </DialogHeader>
          <DialogBody className="px-0">
            <Card bordered={false} className="border rounded-lg border-[#d9d9d9] bg-white">
              <Card.Body className="py-6 px-6 gap-6 max-w-full">
                <div className="flex flex-row items-center self-start justify-center gap-2">
                  <Identicon />
                  <div>
                    <div className="font-bold text-neutral">{account?.meta.name}</div>
                    <div className="font-normal text-gray-500">
                      {trimMiddleString(account?.address)}
                    </div>
                  </div>
                </div>
                <p className="font-normal text-neutral">
                  I just cross-posted this tweet to the{" "}
                  <a
                    className="link link-hover text-[#316CF4] whitespace-nowrap"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://twitter.com/SubsocialChain">
                    @SubsocialChain
                  </a>{" "}
                  network to make it censorship resistant!{" "}
                  <a
                    className="link link-hover text-[#316CF4]"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://polkaverse.com/${contentId?.spaceId}/${contentId?.postId}`}>
                    {`https://polkaverse.com/${contentId?.spaceId}/${contentId?.postId}`}
                  </a>
                  <br />
                  <br />
                  <a className="link text-[#316CF4] no-underline whitespace-nowrap" href="#">
                    #Subsocial
                  </a>
                </p>
              </Card.Body>
            </Card>
          </DialogBody>
          <DialogFooter className="p-0 flex flex-col gap-4">
            <Button
              fullWidth
              //onClick={handleOpen}
              className="normal-case border-0 bg-gradient-to-r from-primary to-secondary">
              <span>Tweet about it!</span>
            </Button>
            <Button
              fullWidth
              onClick={() => setContentId(undefined)}
              className="border-1 border-accent text-accent bg-white hover:bg-accent hover:text-white rounded-lg normal-case whitespace-nowrap">
              <span>Cross-post another tweet</span>
            </Button>
          </DialogFooter>
        </Dialog>
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
