import clsx from "clsx";
import React, { HTMLProps } from "react";
import { MdContentCopy } from "react-icons/md";
import toast from "react-hot-toast";

export type CopyTextProps = HTMLProps<HTMLDivElement> & {
  text: string;
  textToCopy?: string;
  textClassName?: string;
  copyButtonClassName?: string;
  onCopyButtonClick?: () => void;
};

export default function CopyText({
  text,
  textToCopy,
  textClassName,
  copyButtonClassName,
  onCopyButtonClick,
  ...props
}: CopyTextProps) {
  const onClickCopyToClipboard = () => {
    onCopyButtonClick?.();
    navigator.clipboard.writeText(textToCopy || text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div
      {...props}
      className={clsx(
        "flex items-stretch overflow-hidden rounded-md border border-gray-400 bg-white px-3 pr-0",
        props.className,
      )}>
      <div className={clsx("flex-1 py-2", textClassName)}>{text}</div>
      <button
        onClick={onClickCopyToClipboard}
        className={clsx(
          "py-2 text-xl text-gray-600 hover:bg-gray-50 focus:bg-gray-50",
          copyButtonClassName,
        )}>
        <span className="block border-l border-gray-400 px-3">
          <MdContentCopy />
        </span>
      </button>
    </div>
  );
}
