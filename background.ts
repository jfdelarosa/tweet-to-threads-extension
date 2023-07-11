import { login } from "./utils/Threads"

export {}

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const bodyStr = String.fromCharCode.apply(
      null,
      new Uint8Array(details.requestBody.raw[0].bytes)
    )

    const body = JSON.parse(bodyStr)

    if (body?.variables?.reply?.in_reply_to_tweet_id) {
      return
    }

    const tweet = body?.variables?.tweet_text

    console.log("Intercepted tweet:", tweet)

    login(
      process.env.PLASMO_PUBLIC_USERNAME,
      process.env.PLASMO_PUBLIC_PASSWORD,
      tweet
    )
  },
  { urls: ["https://twitter.com/i/api/graphql/*/CreateTweet"] },
  ["requestBody"]
)

chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
  const previousRuleIds = previousRules.map((rule) => rule.id)

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: parseInt(Math.random() * 1000),
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
