import { intercept } from "./src/intercept"
import { getRuleset } from "./src/rules"

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
