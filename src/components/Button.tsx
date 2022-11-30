import { signOut, signIn } from "next-auth/react";
import { Button } from "react-daisyui";

type AuthButtonProps = {
  text: string;
  isSignIn?: boolean;
};

const AuthButton = ({ text, isSignIn }: AuthButtonProps) => {
  if (isSignIn) {
    return (
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() =>
          signIn("twitter", {
            callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}/tweets`,
          })
        }>
        {text}
      </button>
    );
  }

  return (
    <Button
      className="normal-case"
      variant="outline"
      color="primary"
      size="sm"
      fullWidth={true}
      onClick={() =>
        signOut({
          callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}`,
        })
      }>
      {text}
    </Button>
  );
};

export default AuthButton;
