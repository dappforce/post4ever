import clsx from "clsx";
import React, { HTMLProps } from "react";
import { MdContentCopy } from "react-icons/md";
import toast from "react-hot-toast";

export type CopyTextProps = HTMLProps<HTMLDivElement> & {
  text: string;
  textToCopy?: string;
  textClassName?: string;
  copyButtonClassName?: string;
};

export default function CopyText({
  text,
  textToCopy,
  textClassName,
  copyButtonClassName,
  ...props
}: CopyTextProps) {
  const onClickCopyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy || text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div
      {...props}
      className={clsx(
        "flex items-center rounded-md border border-gray-400 bg-white py-2 px-3 pr-0",
        props.className,
      )}>
      <div className={clsx("flex-1", textClassName)}>{text}</div>
      <button
        onClick={onClickCopyToClipboard}
        className={clsx(
          "border-l border-gray-400 px-3 text-xl text-gray-600",
          copyButtonClassName,
        )}>
        <MdContentCopy />
      </button>
    </div>
  );
}
