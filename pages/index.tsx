import type { NextPage, GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import AuthButton from "src/components/Button";
import { useSession } from "next-auth/react";
import FullScreenLoading from "src/components/FullScreenLoading";

const Home: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") return <FullScreenLoading />;

  if (status === "authenticated") router.push("/crosspost");

  return (
    <div className={styles.container}>
      <Head>
        <title>SubTweet - Login</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to SubTweet!</h1>
        <AuthButton text={"Login with Twitter"} isSignIn={true} />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let session = await unstable_getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/crosspost",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
