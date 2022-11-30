import { Card, Avatar } from "react-daisyui";
import { TweetUserProps } from "src/types/common";
import AuthButton from "src/components/Button";

type TwitterUserProfileCardProps = {
  authenticatedUser: TweetUserProps;
};

const TwitterUserProfileCard = ({ authenticatedUser }: TwitterUserProfileCardProps) => (
  <Card className="shadow-2xl m-4 bg-white h-fit" bordered={false}>
    <Card.Body className="items-start gap-4">
      <div className="flex flex-row items-center justify-start gap-2">
        <Avatar src={authenticatedUser.profile_image_url} size="xs" shape="circle" />
        <a
          className="font-semibold text-base-100"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://twitter.com/${authenticatedUser.username}`}>{`@${authenticatedUser.username}`}</a>
      </div>
      <Card.Actions className="w-full">
        <AuthButton text={"Logout"} />
      </Card.Actions>
    </Card.Body>
  </Card>
);

export default TwitterUserProfileCard;
