import { Storage } from "@plasmohq/storage"

import { login } from "./utils/Threads"

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

    const tweet = body?.variables?.tweet_text

    console.log("Intercepted tweet:", tweet)

    await login(
      process.env.PLASMO_PUBLIC_USERNAME,
      process.env.PLASMO_PUBLIC_PASSWORD,
      tweet
    )
    console.log("end")
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
      },
      {
        id: parseInt(Math.random() * 1000),
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: [
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
          urlFilter:
            "i.instagram.com/api/v1/bloks/apps/com.bloks.www.bloks.caa.login.async.send_login_request/"
        }
      }
    ],
    removeRuleIds: previousRuleIds
  })
})
