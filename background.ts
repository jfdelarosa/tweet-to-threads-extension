import { intercept } from "./utils/intercept"
import { getRuleset } from "./utils/rules"

export {}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    ;(async function () {
      await intercept(details)
    })()
  },
  { urls: ["https://twitter.com/i/api/graphql/*/CreateTweet"] },
  ["requestBody"]
)

chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
  const ruleSet = getRuleset(previousRules)

  chrome.declarativeNetRequest.updateDynamicRules(ruleSet)
})
