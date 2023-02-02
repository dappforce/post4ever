import clsx from "clsx";
import { HTMLProps } from "react";

export type ContainerProps = HTMLProps<HTMLDivElement>;

export default function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={clsx(
        "relative w-full",
        "xl:container 2xl:max-w-screen-xl",
        "mx-auto",
        "px-4",
        className,
      )}
    />
  );
}
