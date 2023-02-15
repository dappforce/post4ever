import type { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useCallback, useState } from "react";
import { TweetWithIncludesProps } from "src/types/common";
import { useWalletStore } from "src/store";
import { SuccessPayloadProps } from "src/hooks/subsocial-api.types";
// import TwitterUserProfileCard from "components/cards/TwitterUserProfileCard";
import FetchTweetCard from "components/cards/FetchTweetCard";
import SendTweetCard from "components/cards/SendTweetCard";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import SuccessDialog from "components/SuccessDialog";
import { sidePadding } from "styles/common";
import WalletSelectModal from "components/wallet-connect/WalletSelectModal";
import SavedTweetsLinks from "components/SavedTweetsLinks";

const Layout = dynamic(() => import("src/components/Layout"), {
  ssr: false,
});

const CrossPostPage: NextPage = () => {
  const { account, readyAccounts } = useWalletStore(state => ({
    readyAccounts: state.accounts,
    account: state.account,
  }));

  const [fetchedTweet, setFetchedTweet] = useState<TweetWithIncludesProps | null>(null);

  const handleSetFetchedTweet = (fetchedTweet: TweetWithIncludesProps | null) => {
    setFetchedTweet(fetchedTweet);
  };

  const [contentId, setContentId] = useState<SuccessPayloadProps | undefined>();
  const [isModalOpen, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleSuccessSendTweet = useCallback(({ spaceId, postId }: SuccessPayloadProps) => {
    setContentId({
      postId,
      spaceId,
    });
  }, []);

  const isContentExist = Boolean(contentId);
  const isAccountExist = Boolean(account);
  const isTweetExist = Boolean(fetchedTweet);

  return (
    <>
      <Layout onConnect={handleOpenModal} account={account} accounts={readyAccounts}>
        <div className={clsx("flex max-w-full items-start justify-center pb-8", sidePadding)}>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "min-w-[300px]",
            }}
          />
          <div className="flex w-[700px] flex-col gap-6 py-6">
            {
              // Note: might be useful for twitter auth in the future
              // <TwitterUserProfileCard
              //   disabled={!isAccountExist || isUserExist}
              //   authenticatedUser={user}
              // />
            }

            <FetchTweetCard disabled={!isAccountExist} onFetchTweet={handleSetFetchedTweet} />

            <SendTweetCard
              disabled={!isAccountExist || !isTweetExist}
              fetchedTweet={fetchedTweet}
              onSuccess={handleSuccessSendTweet}
            />
            <SavedTweetsLinks className="flex justify-center" />
          </div>
        </div>

        <WalletSelectModal open={isModalOpen} onClose={() => setOpenModal(false)} />

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

// Note: might be useful for twitter auth in the future
// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   let session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);

//   if (!session) {
//     return {
//       props: {},
//     };
//   }

//   const { token } = session;

//   if (!token) throw new Error("Token not defined!");

//   const twitterClient = new TwitterApi(token);

//   // Tell typescript it's a readonly app
//   const readOnlyClient = twitterClient.readOnly;

//   const { id } = session?.user;
//   const { data: user } = await readOnlyClient.v2.user(id, {
//     "user.fields": ["id", "name", "profile_image_url"],
//   });

//   return {
//     props: { user },
//   };
// }

export default CrossPostPage;
