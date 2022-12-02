import { Card, Avatar, Button } from "react-daisyui";
import { TweetUserProps } from "src/types/common";

import { signOut } from "next-auth/react";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";

type TwitterUserProfileCardProps = {
  authenticatedUser: TweetUserProps;
};

const TwitterUserProfileCard = ({ authenticatedUser }: TwitterUserProfileCardProps) => (
  <Card className="shadow-2xl bg-white flex flex-col gap-2 h-fit" bordered={false}>
    <Card.Body>
      <h2 className="text-lg font-bold text-base-100">1. Connect your Twitter account</h2>
      <div className="flex flex-row justify-center gap-4">
        <div className="flex flex-row justify-center items-center gap-2">
          <Avatar src={authenticatedUser.profile_image_url} size="xs" shape="circle" />
          <a
            className="font-semibold text-base-100"
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
                callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}`,
              })
            }
            className="btn btn-outline border border-gray-500 hover:bg-transparent disabled:bg-transparent ml-auto">
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </Card.Body>
  </Card>
);

export default TwitterUserProfileCard;
