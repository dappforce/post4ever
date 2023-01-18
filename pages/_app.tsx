import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@material-tailwind/react";
import { Unbounded } from "@next/font/google";
import { GoogleAnalytics } from "nextjs-google-analytics";
import CustomHead from "components/CustomHead";

const unbounded = Unbounded({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-unbounded",
});

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <>
      <CustomHead />
      <ThemeProvider>
        <SessionProvider session={pageProps.session}>
          <main className={`${unbounded.variable} font-sans`}>
            <GoogleAnalytics gtagUrl="/js/ga-stat.js" strategy="lazyOnload" trackPageViews />
            <Component {...pageProps} />
          </main>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
