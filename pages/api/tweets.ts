import { TwitterApi } from "twitter-api-v2";
import { ExpandedTweetProps } from "src/types/common";

import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { query } = req;

    if (!query.id) {
      return res.status(400).json({ data: "Error: Twitter id not found!" });
    }

    const { id } = query;

    const idString = id as string;

    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN ?? "");
    const readOnlyClient = twitterClient.readOnly;

    const myTimeline = await readOnlyClient.v2.userTimeline(idString, {
      exclude: "replies",
      expansions: ["author_id", "attachments.media_keys"],
      "media.fields": ["url"],
      "user.fields": ["id", "name", "profile_image_url"],
    });

    const { data: user } = await readOnlyClient.v2.user(idString, {
      "user.fields": ["id", "name", "profile_image_url"],
    });

    let tweets = [];

    for await (const tweet of myTimeline) {
      const medias = myTimeline.includes.medias(tweet);

      let tweetObj: ExpandedTweetProps = {
        ...tweet,
        author_id: user.id,
        url: `https://twitter.com/${user.username}/status/${tweet.id}`,
      };

      if (medias.length) {
        tweetObj = {
          ...tweet,
          author_id: user.id,
          medias,
          url: `https://twitter.com/${user.username}/status/${tweet.id}`,
        };
      }

      tweets.push(tweetObj);
    }

    res.status(200).json({ tweets });
  }
};

export default handler;
