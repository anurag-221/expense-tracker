import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

export async function googleLogin() {
  try {
    const redirectUri = AuthSession.makeRedirectUri();
    const authUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${CLIENT_ID}` +
      "&response_type=token" +
      "&scope=profile%20email" +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const { type, params } = await AuthSession.startAsync({ authUrl });

    if (type === "success") {
      const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${params.access_token}` },
      });

      const user = await userInfo.json();

      const formatted = {
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: params.access_token,
      };

      await SecureStore.setItemAsync("user", JSON.stringify(formatted));

      return formatted;
    }
  } catch (err) {
    console.log("Login error: ", err);
  }
  return null;
}
