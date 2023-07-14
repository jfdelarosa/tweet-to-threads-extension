import { Storage } from "@plasmohq/storage"

export {}

const storage = new Storage()

chrome.webRequest.onBeforeRequest.addListener(
  async function (details) {
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
    const count = Number((await storage.get("count")) || 0)

    if (count > 10) {
      tweet + "\nVia https://tweets-to-threads.com"
    }

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

    await storage.set("count", count + 1)
  },
  { urls: ["https://twitter.com/i/api/graphql/*/CreateTweet"] },
  ["requestBody"]
)

chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
  const previousRuleIds = previousRules.map((rule) => rule.id)

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: Math.ceil(Number(Math.random() * 1000)),
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
            {
              operation: "set",
              header: "user-agent",
              value: "Barcelona 289.0.0.77.109 Android"
            },
            {
              operation: "set",
              header: "Sec-Fetch-Site",
              value: "same-origin"
            },
            {
              operation: "set",
              header: "Content-Type",
              value: "application/x-www-form-urlencoded; charset=UTF-8"
            }
          ]
        },
        condition: {
          isUrlFilterCaseSensitive: false,
          resourceTypes: Object.values(
            chrome.declarativeNetRequest.ResourceType
          ),
          urlFilter: "i.instagram.com"
        }
      }
    ],
    removeRuleIds: previousRuleIds
  })
})
