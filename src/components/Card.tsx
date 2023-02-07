import clsx from "clsx";
import React, { HTMLProps } from "react";

const spacings = {
  medium: clsx("py-4 px-6"),
  large: clsx("px-6 py-8", "md:p-8"),
};
export type CardProps = HTMLProps<HTMLDivElement> & {
  spacing?: keyof typeof spacings;
};

export default function Card({ spacing, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={clsx("rounded-3xl bg-white", spacing && spacings[spacing], className)}
    />
  );
}
