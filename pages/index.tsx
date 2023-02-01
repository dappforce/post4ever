import type { NextPage } from "next";
import HomeLayout from "src/components/HomeLayout";
import clsx from "clsx";
import styles from "styles/index.module.css";
import AppButton from "components/AppButton";

const customTwStyles = {
  baseCard: "rounded-[57px] bg-white",
  baseInnerCard: "rounded-[30px] border border-[#c6cdd0] p-6 md:p-8 h-[300px]",
  cardPadding: "p-[3rem] lg:p-[3.75rem]",
  globeVertPad: "mt-8 gap-8",
  h2: "text-2xl lg:text-[2rem] lg:leading-[2.8rem] font-medium font-unbounded",
  marginSubHeader: "mb-[24px] lg:mb-[32px]",
  p: "text-base lg:text-[1.25rem] lg:leading-[2rem] font-medium",
};

type StepsCardProps = {
  id: string;
  text: string;
};

export const StepsCard = ({ id, text }: StepsCardProps) => {
  return (
    <div
      className={clsx(customTwStyles.baseInnerCard, "flex flex-col items-center gap-4 lg:gap-6")}>
      <div className="flex items-center justify-center">
        <p className="text-[2rem] text-white/80 md:text-[3rem] lg:text-[4rem]">{id}</p>
      </div>
      <p className={clsx(customTwStyles.p)}>{text}</p>
    </div>
  );
};

const Home: NextPage = () => {
  const stepsDetail: StepsCardProps[] = [
    {
      id: "1",
      text: "Connect your wallet",
    },
    {
      id: "2",
      text: "Paste the link of the Tweet you wish to save",
    },
    {
      id: "3",
      text: "Upload your tweet to the blockchain forever",
    },
  ];

  return (
    <>
      <HomeLayout>
        <div className="w-full max-w-[1261px]">
          <div className="mb-[61px]">
            <div className="flex flex-col gap-[1.25rem]">
              <div
                className={clsx(
                  customTwStyles.baseCard,
                  "flex flex-row lg:px-[70px] lg:py-[60px]",
                )}>
                <img
                  className="w-[379px] object-contain"
                  src="/images/NiceCube.png"
                  alt="nice-cube"
                />
                <div>
                  <h2
                    className={clsx(
                      customTwStyles.h2,
                      styles.coloredGradient,
                      customTwStyles.marginSubHeader,
                      "text-center lg:text-left",
                    )}>
                    You don’t own your content on Twitter
                  </h2>
                  <div className="flex flex-col justify-center">
                    <p className={clsx(customTwStyles.p, "mb-[43px] text-[#4A555A]")}>
                      In fact, Twitter can remove your content at will, or even ban you, permanently
                      deleting all of your tweets.
                      <br />
                      <br />
                      With EverPost, you can easily cross-post your tweets to Subsocial’s
                      decentralized network. This means your content is stored on a
                      censorship-resistant blockchain – your tweets will live forever.
                    </p>
                    <AppButton size={"large"} text="Save Tweets" />
                  </div>
                </div>
              </div>

              <div
                className={clsx(
                  customTwStyles.baseCard,
                  customTwStyles.cardPadding,
                  styles.gradientBg,
                )}>
                <h2
                  className={clsx(
                    customTwStyles.h2,
                    customTwStyles.marginSubHeader,
                    "text-center text-white",
                  )}>
                  It's simple:
                </h2>
                <div
                  className={clsx(
                    customTwStyles.marginSubHeader,
                    "grid grid-cols-3 gap-4 lg:gap-8",
                  )}>
                  {stepsDetail.map(step => (
                    <StepsCard key={step.id} id={step.id} text={step.text} />
                  ))}
                </div>
                <div className="text-center">
                  <button
                    className={clsx(
                      "btn !h-[60px] !w-[180px] !rounded-[44px] border-none bg-white hover:bg-white",
                      styles.raise,
                    )}>
                    <span className="text-[20px] font-medium !leading-[130%] text-[#B752B2]">
                      Save Tweets
                    </span>
                  </button>
                </div>
              </div>

              <div
                className={clsx(customTwStyles.baseCard, "px-[60px] pt-[70px]", "flex flex-col")}>
                <h2
                  className={clsx(
                    customTwStyles.h2,
                    styles.coloredGradient,
                    "mb-[24px] text-center",
                  )}>
                  Feature suggestions
                </h2>
                <p
                  className={clsx(
                    customTwStyles.marginSubHeader,
                    "text-center font-bold text-[#4A555A] lg:text-[1.25rem] lg:leading-[160%]",
                  )}>
                  If you have any feature ideas for the app, please let us know.
                </p>
                <div className="mb-[32px] text-center">
                  <AppButton size={"large"} text="Suggest feature" />
                </div>
                <div className="flex items-center justify-center">
                  <img
                    className="w-[470px] object-contain"
                    src="/images/HalfSphere.png"
                    alt="half-sphere"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default Home;
