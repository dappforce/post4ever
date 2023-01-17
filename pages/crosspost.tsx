import type { NextPage, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import React, { useCallback, useState } from "react";
import CustomHead from "components/CustomHead";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { TweetWithAuthorProps } from "src/types/common";
import FullScreenLoading from "src/components/FullScreenLoading";
import { useSession } from "next-auth/react";
import { useWalletStore } from "src/store";
import { unstable_getServerSession } from "next-auth/next";
import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";
import TwitterUserProfileCard from "components/cards/TwitterUserProfileCard";
import { TwitterApi } from "twitter-api-v2";
import { AuthenticatedPageProps } from "src/types/common";
import FetchTweetCard from "components/cards/FetchTweetCard";
import SendTweetCard from "components/cards/SendTweetCard";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

import SuccessDialog from "components/SuccessDialog";
import { sidePadding } from "styles/common";

const Layout = dynamic(() => import("src/components/Layout"), {
  ssr: false,
});

const meta = {
  title: "Post4ever - Cross-post Tweet",
  desc: "Back up your tweets to Subsocial’s censorship resistant network",
};

const CrossPostPage: NextPage = ({ user }: Partial<AuthenticatedPageProps>) => {
  const { status } = useSession();

  const { account } = useWalletStore(state => ({
    account: state.account,
  }));

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

  const isContentExist = Boolean(contentId);
  const isAccountExist = Boolean(account);
  const isUserExist = Boolean(user);
  const isTweetExist = Boolean(fetchedTweet);

  if (status === "loading") return <FullScreenLoading />;

  return (
    <>
      <CustomHead meta={meta} />
      <Layout>
        <div className={clsx("flex h-screen max-w-full items-start justify-center", sidePadding)}>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "min-w-[300px]",
            }}
          />
          <div className="flex w-[700px] flex-col gap-6 py-6">
            <TwitterUserProfileCard
              disabled={!isAccountExist || isUserExist}
              authenticatedUser={user}
            />

            <FetchTweetCard
              disabled={!isUserExist || isTweetExist}
              onFetchTweet={handleSetFetchedTweet}
            />

            <SendTweetCard
              disabled={(!isAccountExist && !isUserExist) || !isTweetExist}
              fetchedTweet={fetchedTweet}
              onSuccess={handleSuccessSendTweet}
            />
          </div>
        </div>

        <SuccessDialog
          open={isContentExist}
          onClose={() => setContentId(undefined)}
          contentId={contentId}
          account={account}
        />
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
