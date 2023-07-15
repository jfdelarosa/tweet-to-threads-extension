export function getRuleset(
  previousRules: chrome.declarativeNetRequest.Rule[]
): chrome.declarativeNetRequest.UpdateRuleOptions {
  const ruleSet: chrome.declarativeNetRequest.UpdateRuleOptions = {
    addRules: [
      {
        id: Math.ceil(Number(Math.random() * 1000)),
        priority: 1,
        action: {
          type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
          requestHeaders: [
            {
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              header: "user-agent",
              value: "Barcelona 289.0.0.77.109 Android"
            },
            {
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
              header: "Sec-Fetch-Site",
              value: "same-origin"
            },
            {
              operation: chrome.declarativeNetRequest.HeaderOperation.SET,
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
    removeRuleIds: previousRules.map((rule) => rule.id)
  }

  return ruleSet
}
