import clsx from "clsx";
import React, { HTMLProps } from "react";

export type GradientTextProps = HTMLProps<HTMLSpanElement>;

export default function GradientText(props: GradientTextProps) {
  return (
    <span
      {...props}
      style={{
        WebkitTextFillColor: "transparent",
      }}
      className={clsx("bg-primary-gradient bg-clip-text", "text-base-pink", props.className)}
    />
  );
}
