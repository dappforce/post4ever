// SPDX-License-Identifier: GPL-3.0-or-later.
// Copyright (C) 2022-2023 DAPPFORCE PTE. LTD., aleksandr.siman@gmail.com.
// Full Notice is available in the root folder.

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
        "relative flex flex-col items-center gap-4 overflow-hidden !pb-32 sm:!pb-36 lg:gap-6",
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
        href="https://post4e.hellonext.co/"
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
