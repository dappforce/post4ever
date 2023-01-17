import Head from "next/head";
import urlJoin from "url-join";
import { appBaseUrl } from "src/configs/urls";

type HeadMetaProps = {
  title: string;
  desc: string;
};

type CustomHeadProps = {
  meta: HeadMetaProps;
};

const META_IMAGE_PATH = "public/images/MetaImage.png";

const CustomHead = ({ meta }: CustomHeadProps) => {
  const { title, desc } = meta;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="icon" href="/images/favicon.svg" />

      <meta property="og:site_name" content={"Post4ever"} />
      <meta property="og:image" content={urlJoin(appBaseUrl, META_IMAGE_PATH)} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={"Post4ever"} />
      <meta name="twitter:image" content={urlJoin(appBaseUrl, META_IMAGE_PATH)} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
    </Head>
  );
};

export default CustomHead;
