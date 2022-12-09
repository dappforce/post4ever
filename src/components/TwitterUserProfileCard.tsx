import { Card, Avatar, Button } from "react-daisyui";
import { useTwitterUserStore, useWalletStore } from "src/store";
import { useEffect } from "react";
import { TweetUserProps } from "src/types/common";

import { signOut, signIn } from "next-auth/react";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";

type TwitterUserProfileCardProps = {
  disabled: boolean;
  authenticatedUser?: TweetUserProps;
};

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
    <Card className="shadow-md bg-white flex flex-col h-fit" bordered={false}>
      <Card.Body className="gap-6">
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
              <div className="flex flex-row justify-center items-center gap-2">
                <Avatar src={authenticatedUser.profile_image_url} size="xs" shape="circle" />
                <a
                  className="font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://twitter.com/${authenticatedUser.username}`}>{`@${authenticatedUser.username}`}</a>
              </div>
              <div className="ml-auto">
                <Button
                  shape="square"
                  size="md"
                  onClick={() =>
                    signOut({
                      callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/crosspost`,
                    })
                  }
                  className="btn btn-outline border border-gray-500 hover:border-red-500 hover:bg-white hover:bg-opacity-0 hover:text-red-500 disabled:bg-transparent ml-auto">
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              className={`normal-case border-0 ${
                !disabled ? "btn bg-gradient-to-r from-primary to-secondary" : "btn btn-disabled"
              }`}
              size="md"
              onClick={() =>
                signIn("twitter", {
                  callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/crosspost`,
                })
              }>
              Connect your Twitter account
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TwitterUserProfileCard;
