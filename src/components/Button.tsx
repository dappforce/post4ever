import clsx from "clsx";
import { HTMLProps } from "react";

const variants = {
  primary: clsx("btn-gradient"),
  white: clsx(
    "bg-white",
    "text-base-pink",
    "hover:bg-gray-200",
    "focus:outline-base-blue focus:bg-gray-200",
  ),
};
const sizes = {
  small: clsx("!px-4 !py-1"),
  medium: clsx("!px-6 !py-2"),
  large: clsx("!px-8 !py-2.5"),
};
type Size = keyof typeof sizes;
type Variant = keyof typeof variants;

type HTMLButtonProps = Omit<HTMLProps<HTMLButtonElement>, "size" | "type">;
type HTMLAnchorProps = HTMLProps<HTMLAnchorProps>;

export type ButtonProps = (HTMLButtonProps | HTMLAnchorProps) & {
  size?: Size;
  type?: "button" | "submit" | "reset";
  variant?: Variant;
};

const Button = ({
  size = "medium",
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) => {
  const Element = props.href ? "a" : "button";
  return (
    <Element
      {...(props as any)}
      className={clsx(
        "btn text-base",
        "!h-auto !min-h-0",
        "!rounded-full border-none",
        "font-medium !leading-normal",
        variants[variant],
        sizes[size],
        className,
      )}>
      {children}
    </Element>
  );
};

export default Button;
