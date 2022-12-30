import Head from "next/head";
import SubTweet from "src/assets/SubTweet.svg";
import ST from "public/ST.svg";

import React from "react";

import AppButton from "./AppButton";

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div style={{ position: "relative" }}>
      <Head>
        <title>EverPost - Landing Page</title>
        <meta
          name="description"
          content="Back up your tweets to Subsocial’s censorship resistant network"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="sticky top-0 z-10 flex min-h-[70px] items-center justify-between bg-white px-[0.5rem] py-[0.875rem] lg:px-[2rem]">
        <div className="hidden sm:block">
          <SubTweet />
        </div>
        <div className="sm:hidden">
          <ST />
        </div>
        <div>
          <AppButton size={"small"} text={"Enter App"} />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center bg-light-gray px-[8px] sm:px-[32px] lg:px-[90px]">
        <>{children}</>
        <footer className="z-10 flex min-h-[109px] w-full max-w-[1261px] items-center">
          <SubTweet />
        </footer>
      </main>

      <div className="absolute bottom-0 left-0 h-[109px] w-full bg-white"></div>
    </div>
  );
};

export default HomeLayout;
