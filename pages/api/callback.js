import { setCookie } from "cookies-next";

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const AUTH_ENDPOINT = "https://accounts.spotify.com/api/token";
const AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, "utf-8").toString(
  "base64"
);

export default async (req, res) => {
  const code = req.query.code || null;
  const DATA = new URLSearchParams({
    code: code,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch(AUTH_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${AUTH}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: DATA,
    });
    const data = await response.json();
    setCookie("token", data.refresh_token, {
      req,
      res,
      httpOnly: false,
      maxAge: 60 * 60 * 24,
    });
    res.redirect(307, "/dashboard");
  } catch (error) {
    console.log(error);
    res.redirect(500, "/");
  }
};
