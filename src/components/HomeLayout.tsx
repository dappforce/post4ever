import Post4Ever from "public/images/Post4Ever.svg";
import P4 from "public/images/P4.svg";

import React from "react";

import AppButton from "./AppButton";

type HomeLayoutProps = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div style={{ position: "relative" }}>
      <header className="sticky top-0 z-10 flex min-h-[70px] items-center justify-between bg-white px-[0.5rem] py-[0.875rem] lg:px-[2rem]">
        <div className="hidden sm:block">
          <Post4Ever />
        </div>
        <div className="sm:hidden">
          <P4 />
        </div>
        <div>
          <AppButton size={"small"} text={"Enter App"} />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center bg-light-gray px-[8px] sm:px-[32px] lg:px-[90px]">
        <>{children}</>
        <footer className="z-10 flex min-h-[109px] w-full max-w-[1261px] items-center">
          <Post4Ever />
        </footer>
      </main>

      <div className="absolute bottom-0 left-0 h-[109px] w-full bg-white"></div>
    </div>
  );
};

export default HomeLayout;
