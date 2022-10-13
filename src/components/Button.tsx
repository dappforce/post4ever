import { signOut, signIn } from "next-auth/react";

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
        }
      >
        {text}
      </button>
    );
  }

  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      onClick={() =>
        signOut({
          callbackUrl: `${process.env.NEXT_PUBLIC_AUTH_URL}`,
        })
      }
    >
      {text}
    </button>
  );
};

export default AuthButton;
