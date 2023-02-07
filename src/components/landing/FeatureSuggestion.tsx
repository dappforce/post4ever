import clsx from "clsx";
import Button from "components/Button";
import Card, { CardProps } from "components/Card";
import GradientText from "components/GradientText";
import Image from "next/image";
import React from "react";
import HalfSphere from "src/assets/half-sphere.png";

export type FeatureSuggestionProps = CardProps;

export default function FeatureSuggestion(props: FeatureSuggestionProps) {
  return (
    <Card
      spacing="large"
      className={clsx(
        "relative flex flex-col items-center gap-4 overflow-hidden !pb-32 lg:gap-6 lg:!pb-36",
        props.className,
      )}>
      <h2 className="text-center font-unbounded text-2xl font-medium lg:text-3xl">
        <GradientText>Feature suggestions</GradientText>
      </h2>
      <p className="text-center lg:text-lg">
        If you have any feature ideas for this app, please let us know.
      </p>
      <Button
        size="large"
        className="mt-2 lg:text-lg"
        href="https://forms.clickup.com/9008022125/p/f/8ceq0kd-8261/FLJSBRH2PYGGK5K7Z9/suggestafeature"
        rel="noopener noreferrer"
        target="_blank">
        Suggest Feature
      </Button>
      <Image
        src={HalfSphere}
        className="absolute bottom-0 w-full max-w-lg"
        role="presentation"
        alt=""
      />
    </Card>
  );
}
