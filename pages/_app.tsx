import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@material-tailwind/react";
import { Unbounded } from "@next/font/google";

const unbounded = Unbounded({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-unbounded",
});

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ThemeProvider>
      <SessionProvider session={pageProps.session}>
        <main className={`${unbounded.variable} font-sans`}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
