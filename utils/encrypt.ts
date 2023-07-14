import CryptoJS from "crypto-js"
import { v4 as uuidv4 } from "uuid"

import { BASE_API_URL, LOGIN_EXPERIMENTS, SIGNATURE_KEY } from "./constants"
import { LATEST_ANDROID_APP_VERSION } from "./dynamic-data"

async function sign(payload: object) {
  const json = JSON.stringify(payload)

  try {
    const signature = CryptoJS.HmacSHA256(json, SIGNATURE_KEY).toString()

    return {
      ig_sig_key_version: 4,
      signed_body: `${signature}.${json}`
    }
  } catch (error) {
    console.error(error)
    throw new Error("Error signing the payload")
  }
}

async function qeSync() {
  const uuid = uuidv4()
  const params = {
    id: uuid
  }

  const body = await sign(params)

  return await fetch(BASE_API_URL + "/api/v1/qe/sync/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": `Barcelona ${LATEST_ANDROID_APP_VERSION} Android`,
      "Sec-Fetch-Site": "same-origin",
      "X-DEVICE-ID": uuid
    },
    body: `params=${encodeURIComponent(JSON.stringify(body))}`
  }).then((res) => {
    return res
  })
}

export async function encryptPassword(password) {
  const key = crypto.getRandomValues(new Uint8Array(32)) // Generate a random key
  const iv = crypto.getRandomValues(new Uint8Array(12)) // Generate a random IV
  let keyId
  let pubKey

  try {
    await qeSync().then(async (res) => {
      const headers = res.headers
      keyId = headers.get("ig-set-password-encryption-key-id")
      pubKey = headers.get("ig-set-password-encryption-pub-key")
    })
  } catch (error) {
    console.log(error)
  }

  console.log(22222)
  let rsaEncrypted
  try {
    rsaEncrypted = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      await crypto.subtle.importKey(
        "spki",
        Uint8Array.from(atob(pubKey), (c) => c.charCodeAt(0)),
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        false,
        ["encrypt"]
      ),
      key
    )
  } catch (error) {
    console.log(error)
  }

  console.log(333333)

  const cipher = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
      additionalData: new TextEncoder().encode(
        Math.floor(Date.now() / 1000).toString()
      ),
      tagLength: 128
    },
    await crypto.subtle.importKey(
      "raw",
      key,
      {
        name: "AES-GCM"
      },
      false,
      ["encrypt"]
    ),
    new TextEncoder().encode(password)
  )
  console.log(44444)

  const time = Math.floor(Date.now() / 1000).toString()

  const sizeBuffer = new ArrayBuffer(2)
  const sizeView = new DataView(sizeBuffer)
  sizeView.setInt16(0, rsaEncrypted.byteLength)
  console.log(5555)

  const authTag = new Uint8Array(await crypto.subtle.exportKey("raw", cipher))
  const aesEncrypted = new Uint8Array(cipher)
  console.log(66666)

  const passwordBuffer = new Uint8Array([
    1,
    parseInt(keyId, 10),
    ...iv,
    ...new Uint8Array(sizeBuffer),
    ...new Uint8Array(rsaEncrypted),
    ...authTag,
    ...aesEncrypted
  ])
  console.log(7777)

  return {
    time,
    password: btoa(String.fromCharCode(...passwordBuffer))
  }
}
