import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export async function intercept(details) {
  const postToThreads = await storage.get("postToThreads")

  if (!postToThreads) {
    return
  }

  const bodyStr = String.fromCharCode.apply(
    null,
    new Uint8Array(details.requestBody.raw[0].bytes)
  )

  const body = JSON.parse(bodyStr)

  if (body?.variables?.reply?.in_reply_to_tweet_id) {
    return
  }

  let tweet = body?.variables?.tweet_text

  console.log("Intercepted tweet:", tweet)

  await fetch(process.env.PLASMO_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: process.env.PLASMO_PUBLIC_USERNAME,
      password: process.env.PLASMO_PUBLIC_PASSWORD,
      text: tweet
    })
  })
}
