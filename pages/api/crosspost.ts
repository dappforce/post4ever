import { TwitterApi } from "twitter-api-v2";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { tweetId } = req.query;

    if (!tweetId) {
      return res.status(400).json({ data: "Error: tweet id not found!" });
    }

    if (!process.env.TWITTER_BEARER_TOKEN) throw new Error("Problem with Twitter API");

    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    const readOnlyClient = twitterClient.readOnly;
    const { data, includes } = await readOnlyClient.v2.get(`tweets/${tweetId}`, {
      expansions: [
        "author_id",
        "attachments.media_keys",
        "attachments.poll_ids",
        "referenced_tweets.id",
      ],
      "tweet.fields": [
        "created_at",
        "author_id",
        "conversation_id",
        "in_reply_to_user_id",
        "referenced_tweets",
        "attachments",
        "lang",
      ],
      "media.fields": [
        "height",
        "media_key",
        "preview_image_url",
        "type",
        "url",
        "width",
        "alt_text",
      ],
      "user.fields": ["id", "name", "username", "profile_image_url"],
    });

    // Send a HTTP success code
    res.status(200).json({ data, includes });
  }
};

export default handler;
