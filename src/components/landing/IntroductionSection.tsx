import clsx from "clsx";
import Button from "components/Button";
import Card, { CardProps } from "components/Card";
import GradientText from "components/GradientText";
import Image from "next/image";
import React from "react";
import Cube from "src/assets/cube.png";

export type IntroductionSectionProps = CardProps;

export default function IntroductionSection(props: IntroductionSectionProps) {
  return (
    <Card {...props} spacing="large" className={clsx("w-full !pt-0 md:!pt-8", props.className)}>
      <div className="-mt-4 flex flex-col items-center md:m-0 md:grid md:grid-cols-[1fr,2fr]">
        <Image
          src={Cube}
          className="mb-4 w-1/2 md:w-full md:py-6 md:pr-8"
          role="presentation"
          alt=""
        />
        <div className="flex flex-col items-center md:items-start">
          <h2 className="mb-6 text-center font-unbounded text-2xl font-medium md:text-left lg:mb-8 lg:text-3xl">
            <GradientText>You don’t own your content on Twitter</GradientText>
          </h2>
          <div className="flex flex-1 flex-col gap-4 lg:text-lg">
            <p>
              In fact, Twitter can remove your content at will, or even ban you, permanently
              deleting all of your X posts.
            </p>
            <p>
              With Post4ever, you can easily cross-post your X posts to Subsocial’s decentralized
              network. This means your content is stored on a censorship-resistant blockchain – your
              X posts will live forever.
            </p>
            <div className="sm:mt-2 lg:mt-4">
              <Button
                className="w-full md:w-auto lg:text-lg"
                href="/crosspost"
                target="_blank"
                size="large">
                Save X posts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
