import Head from "next/head";
import urlJoin from "url-join";
import { appBaseUrl } from "src/configs/urls";

const META_IMAGE_PATH = "/images/MetaImage.png";

const CustomHead = () => {
  const meta = {
    title: "Post4Ever | Save X posts on a censorship resistant network",
    desc: "Back up your X content using Subsocial, a decentralized Web3 social networking platform. Take ownership of your X posts by putting them on the blockchain.",
  };

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.desc} />
      <link rel="icon" href="/images/favicon.svg" />

      <meta property="og:site_name" content={"Post4ever"} />
      <meta property="og:image" content={urlJoin(appBaseUrl, META_IMAGE_PATH)} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.desc} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={"Post4ever"} />
      <meta name="twitter:image" content={urlJoin(appBaseUrl, META_IMAGE_PATH)} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.desc} />
    </Head>
  );
};

export default CustomHead;
