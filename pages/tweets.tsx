import type { NextPage, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useEffect, useState } from "react";
import { TwitterApi } from "twitter-api-v2";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import Image from "next/image";
import { useSubSocialApiHook } from "src/hooks/use-subsocial-api";
import { TweetsProps, TweetProps, PostProps } from "src/types/common";

const TweetPage: NextPage<TweetsProps> = ({ tweets }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { postTransaction, subsocialApi, initApi } = useSubSocialApiHook();
  const [savedPosts, setSavedPosts] = useState<PostProps[]>([]);

  useEffect(() => {
    if (savedPosts.length === 2 && session) {
      initApi(session?.mnemonic);
    }
  }, [savedPosts.length, session]);

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated")
    return (
      <div>
        <p>Access unauthorized, please login first</p>
        <button onClick={() => router.push("/")}>Go back to login</button>
      </div>
    );

  if (!session) return null;

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

      <div className="flex flex-row items-center justify-center max-w-full max-h-screen">
        <div>
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
                <div className="flex flex-row items-center self-start justify-center gap-2">
                  <Image
                    src={session.user?.image ?? ""}
                    alt="user-avatar"
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
        <div>
          <button
            onClick={handlePostTransaction}
            disabled={
              !(savedPosts.length > 0 || savedPosts.length <= 2) ? true : false
            }
          >
            Send to IPFS!
          </button>
          <div>This is wallet section</div>
        </div>
      </div>
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

  let tweets = [];

  for await (const tweet of myTimeline) {
    const medias = myTimeline.includes.medias(tweet);

    if (medias.length) {
      const tweetObj = {
        ...tweet,
        medias,
      };

      tweets.push(tweetObj);
    } else {
      tweets.push(tweet);
    }
  }

  return {
    props: { tweets },
  };
}

export default TweetPage;
