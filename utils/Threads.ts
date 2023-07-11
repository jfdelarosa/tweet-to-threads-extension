import { getToken } from "./Bloks"

const androidId = (Math.random() * 1e24).toString(36)

export async function login(username, password, tweet) {
  const base = "https://i.instagram.com"
  const loginUrl =
    "/api/v1/bloks/apps/com.bloks.www.bloks.caa.login.async.send_login_request/"

  const params = {
    client_input_params: {
      password: password,
      contact_point: username,
      device_id: `android-${androidId}`
    },
    server_params: {
      credential_type: "password",
      device_id: `android-${androidId}`
    }
  }

  const requestOptions = {
    method: "POST",
    body: `params=${encodeURIComponent(
      JSON.stringify(params)
    )}&bloks_versioning_id=00ba6fa565c3c707243ad976fa30a071a625f2a3d158d9412091176fe35027d8`
  }

  const response = await fetch(base + loginUrl, requestOptions)
  const text = await response.text()

  const token = getToken(text)

  await create(tweet, 421948434, token)
}

async function create(contents, user, token, data = null) {
  const requestBody = {
    publish_mode: "text_post",
    text_post_app_info: '{"reply_control":0}' + data !== null ? data : "",
    timezone_offset: "-25200",
    source_type: "4",
    _uid: user,
    device_id: `android-${androidId}`,
    caption: contents,
    upload_id: new Date().getTime(),
    device: {
      manufacturer: "OnePlus",
      model: "ONEPLUS+A3010",
      android_version: 25,
      android_release: "7.1.1"
    }
  }
  return await fetch(
    `https://i.instagram.com/api/v1/media/configure_text_only_post/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer IGT:2:${token}`
      },
      body: `signed_body=SIGNATURE.${encodeURIComponent(
        JSON.stringify(requestBody)
      )}`
    }
  )
}
