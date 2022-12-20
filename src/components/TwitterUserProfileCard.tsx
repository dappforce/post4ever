import { Card, Avatar, Button } from "react-daisyui";
import { useTwitterUserStore } from "src/store";
import { useEffect } from "react";
import { TweetUserProps } from "src/types/common";

import { signOut, signIn } from "next-auth/react";

import { useSession } from "next-auth/react";

type TwitterUserProfileCardProps = {
  disabled: boolean;
  authenticatedUser?: TweetUserProps;
};

const logoutIcon = (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      className="group-hover:fill-red-500 group-hover:opacity-100"
      id="Vector"
      fill="black"
      fillOpacity="0.54"
      strokeWidth={0.5}
      d="M10.332 2.66667L9.39203 3.60667L11.112 5.33333H4.33203V6.66667H11.112L9.39203 8.38667L10.332 9.33333L13.6654 6L10.332 2.66667ZM1.66536 1.33333H6.9987V0H1.66536C0.932031 0 0.332031 0.6 0.332031 1.33333V10.6667C0.332031 11.4 0.932031 12 1.66536 12H6.9987V10.6667H1.66536V1.33333Z"
    />
  </svg>
);

const TwitterUserProfileCard = ({ disabled, authenticatedUser }: TwitterUserProfileCardProps) => {
  const { data: session, status } = useSession();

  const { user, setNewUser } = useTwitterUserStore(state => ({
    user: state.user,
    setNewUser: state.setNewUser,
  }));

  useEffect(() => {
    if (authenticatedUser) {
      setNewUser({
        ...user,
      });
    }
  }, [authenticatedUser]);

  return (
    <Card className="flex h-fit flex-col rounded-[14px] bg-white shadow-md" bordered={false}>
      <Card.Body className="gap-4 md:gap-6">
        <h2 className={`text-lg font-bold ${disabled ? "text-[#A0ADB4]" : "text-neutral"}`}>
          1. Connect your Twitter account
        </h2>
        <div
          className={`flex flex-row ${
            session && status === "authenticated" && authenticatedUser
              ? "justify-center"
              : "justify-start"
          } gap-4`}>
          {session && status === "authenticated" && authenticatedUser ? (
            <>
              <div className="flex flex-row items-center justify-center gap-2">
                <Avatar src={authenticatedUser.profile_image_url} size="xs" shape="circle" />
                <div className="flex flex-col">
                  <a
                    className="font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="#">{`${authenticatedUser.name}`}</a>
                  <a
                    className="font-normal text-gray-500"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://twitter.com/${authenticatedUser.username}`}>{`@${authenticatedUser.username}`}</a>
                </div>
              </div>
              <div className="ml-auto flex items-center justify-center">
                <Button
                  startIcon={logoutIcon}
                  shape="square"
                  className="group btn btn-outline ml-auto w-fit border border-gray-500/[0.54] px-4 normal-case text-gray-500 hover:border-red-500/[0.54] hover:bg-white hover:text-red-500/[0.54] disabled:bg-transparent"
                  onClick={() =>
                    signOut({
                      callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/crosspost`,
                    })
                  }>
                  <p className="hidden md:block">Disconnect</p>
                </Button>
              </div>
            </>
          ) : (
            <Button
              className={`border-0 normal-case ${
                !disabled
                  ? "btn bg-gradient-to-r from-primary to-secondary hover:brightness-110"
                  : "btn btn-disabled"
              }`}
              onClick={() =>
                signIn("twitter", {
                  callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/crosspost`,
                })
              }>
              Connect Twitter
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TwitterUserProfileCard;
