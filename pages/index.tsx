import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (status === "authenticated") router.push("/tweets");

  return (
    <div className={styles.container}>
      <Head>
        <title>Perma-Tweeter</title>
        <meta name="description" content="Store your Tweet, permanently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Perma-Tweeter!</h1>
        <button
          onClick={() =>
            signIn("twitter", {
              callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/tweets`,
            })
          }
        >
          Login with Twitter here
        </button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
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
