import type { NextPage } from "next";
import HomeLayout from "src/components/HomeLayout";
import clsx from "clsx";
import styles from "styles/index.module.css";

import AppButton from "components/AppButton";

const customTwStyles = {
  baseCard: "rounded-[57px] bg-white",
  baseInnerCard: "rounded-[30px] border border-[#c6cdd0] p-6 md:p-8",
  cardPadding: "p-[3rem] lg:p-[3.75rem]",
  globeVertPad: "mt-8 gap-8",
  h2: "text-2xl lg:text-[2rem] lg:leading-[2.8rem] font-medium font-unbounded",
  marginSubHeader: "mb-[24px] lg:mb-[40px]",
  p: "text-base lg:text-[1.25rem] lg:leading-[2rem] font-medium",
};

type StepsCardProps = {
  id: string;
  text: string;
  imageUrl: string;
};

export const StepsCard = ({ id, text, imageUrl }: StepsCardProps) => {
  return (
    <div
      className={clsx(customTwStyles.baseInnerCard, "flex flex-row items-center gap-4 lg:gap-6")}>
      <div className="flex items-center justify-center">
        <p className={clsx(styles.coloredDigit, "text-[2rem] md:text-[3rem] lg:text-[4rem]")}>
          {id}
        </p>
      </div>
      <p className={clsx(customTwStyles.p)}>{text}</p>
      <div className="ml-auto hidden md:block">
        <img src={imageUrl} alt={`${imageUrl}-description`} className="h-auto w-[245px]" />
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const stepsDetail: StepsCardProps[] = [
    {
      id: "1",
      text: "Simply connect your wallet and Twitter account",
      imageUrl: "/Step1.png",
    },
    {
      id: "2",
      text: "Paste the link of the tweet you wish to cross-post",
      imageUrl: "/Step2.png",
    },
    {
      id: "3",
      text: "Select a space to post it in",
      imageUrl: "/Step3.png",
    },
    {
      id: "4",
      text: "Sign the transaction",
      imageUrl: "/Step4.png",
    },
  ];

  return (
    <HomeLayout>
      <div className="w-full max-w-[1261px]">
        <div className="mb-[61px]">
          <div
            className={clsx(
              customTwStyles.globeVertPad,
              "mb-[121px] flex w-full flex-col-reverse items-center justify-between lg:my-[121px] lg:flex-row",
            )}>
            <div className="lg:max-w-[580px]">
              <h1 className="mb-[1.5rem] text-center font-unbounded text-3xl font-medium lg:text-left lg:text-[2.5rem] lg:leading-[3.5rem]">
                Back up your tweets to Subsocial’s censorship resistant network
              </h1>
              <div className="text-center lg:text-left">
                <AppButton size={"medium"} text="Enter App" />
              </div>
            </div>

            <img
              src="/BigMultiCircles.svg"
              className="max-w-[50vw] md:max-w-[40vw] lg:max-w-[549px]"
              alt="big-multi-lines"
            />
          </div>

          <div className="flex flex-col gap-[1.25rem]">
            <div className={clsx(customTwStyles.baseCard, "relative p-[3rem] lg:p-0")}>
              <img
                src="/SmallMeridianLines.svg"
                className="absolute bottom-0 right-0 w-[30%] md:w-[20%] lg:right-auto lg:w-[382px]"
                alt="small-meridian-lines"
              />
              <div className="grid justify-between sm:grid-cols-[100%] lg:grid-cols-[33%_66%] lg:pr-[60px]">
                <div className="w-[30%] md:w-[40%] lg:w-[382px]"></div>
                <div className="pt-0 pb-0 lg:pt-[59px] lg:pb-[74px]">
                  <h2
                    className={clsx(
                      customTwStyles.h2,
                      styles.coloredGradient,
                      customTwStyles.marginSubHeader,
                      "text-center lg:text-left",
                    )}>
                    You don’t own your content on Twitter
                  </h2>
                  <div className="flex flex-col justify-center px-0 lg:px-8">
                    <p className={clsx(customTwStyles.p, "mb-[43px]")}>
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
            </div>

            <div className={clsx(customTwStyles.baseCard, customTwStyles.cardPadding)}>
              <h2
                className={clsx(
                  customTwStyles.h2,
                  styles.coloredGradient,
                  customTwStyles.marginSubHeader,
                  "text-center",
                )}>
                How it works
              </h2>
              <div className={clsx(customTwStyles.marginSubHeader, "flex flex-col gap-4 lg:gap-6")}>
                {stepsDetail.map(step => (
                  <StepsCard key={step.id} id={step.id} text={step.text} imageUrl={step.imageUrl} />
                ))}
              </div>
              <div className="text-center">
                <AppButton size={"large"} text="Connect" />
              </div>
            </div>

            <div
              className={clsx(
                customTwStyles.baseCard,
                customTwStyles.cardPadding,
                "flex flex-col",
              )}>
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
                  "text-center text-xl font-medium lg:text-[1.5rem] lg:leading-[190%]",
                )}>
                If you have any feature ideas for the app, please let us know.
              </p>
              <div className="text-center">
                <AppButton size={"large"} text="Suggest Features" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
