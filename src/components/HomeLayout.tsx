import Post4Ever from "public/images/Post4Ever.svg";
import HeroSection from "./landing/HeroSection";

import React from "react";

import Button from "./Button";
import Container from "./Container";

type HomeLayoutProps = {
  children: React.ReactNode;
};

const logoSize = {
  small: {
    height: 12,
    width: 105,
  },
  large: {
    height: 19,
    width: 165,
  },
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <header className="sticky top-0 z-10 bg-white py-4">
        <Container className="flex items-center justify-between">
          <Post4Ever className="h-3.5 md:h-4" />
          <div>
            <Button href="/crosspost" target="_blank">
              Enter App
            </Button>
          </div>
        </Container>
      </header>
      <main className="flex-1 bg-light-gray">
        <HeroSection />
        <div className="flex flex-1 flex-col items-center justify-center bg-light-gray py-10">
          {children}
        </div>
      </main>
      <footer className="z-10 mt-auto flex w-full items-center bg-white py-8">
        <Container>
          <Post4Ever />
        </Container>
      </footer>
    </div>
  );
};

export default HomeLayout;
