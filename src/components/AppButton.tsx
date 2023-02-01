import clsx from "clsx";
import { useRouter } from "next/router";

const SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

type Size = typeof SIZE[keyof typeof SIZE];

type AppButtonProps = {
  size: Size;
  text: string;
};

const AppButton = ({ size, text }: AppButtonProps) => {
  const router = useRouter();

  const EVERPOST_GFORM_URL = "https://forms.gle/gyMjWUdnXPN6Tv4PA";

  const handleClick = () => {
    if (text === "Suggest feature") {
      window.open(EVERPOST_GFORM_URL, "_blank");
    } else {
      router.push("/crosspost");
    }
  };

  return (
    <button
      className={clsx("btn-gradient btn !h-[60px] !rounded-[44px] border-none", {
        "!h-[42px] !w-[140px]": size === "small",
        "w-[180px]": size === "medium",
        "w-[200px]": size === "large",
      })}
      onClick={handleClick}>
      <span className="text-[1.25rem] font-medium !leading-[130%]">{text}</span>
    </button>
  );
};

export default AppButton;
