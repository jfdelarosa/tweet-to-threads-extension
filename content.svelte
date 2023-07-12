<script context="module" lang="ts">
  import cssText from "data-text:~style.css"
  import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"

  export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
  }

  export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
    document.querySelector(
      ".css-1dbjc4n.r-xoduu5.r-18u37iz.r-kzbkwu > .css-1dbjc4n"
    )

  export const config: PlasmoCSConfig = {
    matches: ["https://*.twitter.com/*"]
  }

  // export const mountShadowHost: PlasmoMountShadowHost = ({
  //   anchor,
  //   shadowHost
  // }) => {
  //   anchor!.element!.insertBefore(shadowHost!, anchor!.element!.firstChild)
  // }
</script>

<script>
  let postToThreads = false

  function handleToggle() {
    postToThreads = !postToThreads
  }
</script>

<div>
  <button class="btn btn-xs btn-primary" on:click={handleToggle}>
    Post to threads: {postToThreads ? "✅" : "❌"}
  </button>
</div>
