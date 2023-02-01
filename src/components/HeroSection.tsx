import clsx from "clsx";
import styles from "styles/index.module.css";

const HeroSection = () => {
  return (
    <div className={clsx(styles.hero, "hero flex min-h-[778px] flex-row lg:pl-[90px]")}>
      <div className="flex flex-col justify-center">
        <h1
          className={
            "mb-8 text-center font-unbounded text-3xl font-medium text-white lg:text-left lg:text-[2.5rem] lg:leading-[3.5rem]"
          }>
          Back up your tweets to Subsocial’s censorship resistant network
        </h1>
        <div className="text-center lg:text-left">
          <button
            className={clsx(
              "btn !h-[60px] !w-[180px] !rounded-[44px] border-none bg-white !px-[42px] !py-[17px] hover:bg-white",
              styles.raise,
            )}>
            <span className="text-[20px] font-medium !leading-[130%] text-[#B752B2]">
              Enter App
            </span>
          </button>
        </div>
      </div>
      <img src="/images/NiceDiamond.png" alt="nice-diamond" />
    </div>
  );
};

export default HeroSection;
