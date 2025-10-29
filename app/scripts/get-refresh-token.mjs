import { google } from "googleapis";
import "dotenv/config";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback"
);

const url = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://mail.google.com/"],
  redirect_uri: "http://localhost:3000/oauth2callback",
});

console.log("Authorize this app by visiting this url:", url);

const code = "PASTE_THE_CODE_FROM_GOOGLE_HERE";

async function getRefreshToken() {
  const { tokens } = await oAuth2Client.getToken(code);
  console.log("Refresh Token:", tokens.refresh_token);
}

getRefreshToken();

/**
 * This script is used to obtain a Gmail OAuth2 refresh token.
 * The refresh token will later be stored in '.env' and used by nodemailer
 * to send emails from the site owner's Gmail account.
 *
 * For the complete Google OAuth2 setup and instructions on obtaining the refresh token using this script,
 * see docs/google-oauth-setup.md
 *
 * Once you have the refresh token saved, you do not need to run this script again.
 */
