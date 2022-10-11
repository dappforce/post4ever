import type { NextPage } from "next";
import { TwitterApi } from "twitter-api-v2";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { instantiateClient } from "src/lib/TwitterClient.ts";

const TweetPage: NextPage = (props) => {
  const { data } = props;
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated")
    return (
      <div>
        <p>Access unauthorized, please login first</p>
        <button onClick={() => router.push("/")}>Go back to login</button>
      </div>
    );

  return (
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
      <div>This is the tweet page</div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const token = process.env.TWITTER_BEARER_TOKEN;
  // Instantiate with desired auth type (here's Bearer v2 auth)
  //
  const twitterClient = new TwitterApi(token);

  // Tell typescript it's a readonly app
  const readOnlyClient = twitterClient.readOnly;

  // get TweetUserTimelineV2Paginator
  const myTimeline = await readOnlyClient.v2.userTimeline("435050680", {});

  const tweets = myTimeline._realData.data;

  return {
    props: { data: tweets },
  };
}

export default TweetPage;
