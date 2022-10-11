import type { NextPage } from "next";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const TweetPage: NextPage = () => {
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

export default TweetPage;
