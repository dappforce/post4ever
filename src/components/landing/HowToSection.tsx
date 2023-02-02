import clsx from "clsx";
import Button from "components/Button";
import Card, { CardProps } from "components/Card";
import Image from "next/image";
import React, { HTMLProps } from "react";
import Background from "src/assets/bg-sunset-pink.png";

export type HowToSectionProps = CardProps;

export default function HowToSection(props: HowToSectionProps) {
  return (
    <Card
      {...props}
      spacing="large"
      className={clsx("relative overflow-hidden bg-base-pink md:py-12 lg:px-16", props.className)}>
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="mb-6 font-unbounded text-2xl font-medium text-white lg:text-3xl">
          It’s simple:
        </h2>
        <div className="flex w-full flex-col gap-6 md:grid md:grid-cols-3">
          <StepCard number={1} text="Connect your wallet" />
          <StepCard number={2} text="Paste the link of the Tweet you wish to save" />
          <StepCard number={3} text="Upload your tweet to the blockchain forever" />
        </div>
        <Button
          variant="white"
          size="large"
          className="mt-8 w-full md:w-auto lg:text-lg"
          href="/crosspost"
          target="_blank">
          Save Tweets
        </Button>
      </div>
      <Image
        className="absolute inset-0 h-full w-full object-cover"
        src={Background}
        role="presentation"
        alt=""
      />
    </Card>
  );
}

type StepCardProps = Omit<HTMLProps<HTMLDivElement>, "children"> & {
  text: string;
  number: number;
};
function StepCard({ text, number, ...props }: StepCardProps) {
  return (
    <div
      {...props}
      className={clsx(
        "flex items-center rounded-3xl bg-white/25 p-8 backdrop-blur-md md:flex-col md:p-6 lg:p-12",
        props.className,
      )}>
      <span className="mr-4 w-14 shrink-0 text-center font-unbounded text-6xl font-bold text-white/80 md:mr-0 md:mb-6 md:w-auto md:text-8xl">
        {number}
      </span>
      <span className="text-lg font-bold text-white md:text-center">{text}</span>
    </div>
  );
}
