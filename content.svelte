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
</script>

<script>
  import { Storage } from "@plasmohq/storage"
  import { onMount } from "svelte"

  const storage = new Storage()
  let postToThreads = false

  async function handleToggle() {
    postToThreads = !postToThreads
    await storage.set("postToThreads", postToThreads)
  }

  onMount(async () => {
    postToThreads = await storage.get("postToThreads")
  })
</script>

<div class="pt-[1px] ml-2">
  <button
    class="btn btn-xs rounded-full btn-primary border-slate-300 text-blue-500"
    on:click={handleToggle}>
    Post to threads: {postToThreads ? "✅" : "❌"}
  </button>
</div>
