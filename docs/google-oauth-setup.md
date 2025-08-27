# Google OAuth2 Setup for Nodemailer

This guide explains step-by-step how to set up Gmail OAuth2 credentials in Google Cloud Console and generate a refresh token for sending emails using Nodemailer in this project.

---

## 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a project → New Project**.
3. Give your project a name and click **Create**.

---

## 2. Enable Gmail API
1. In your project, go to **APIs & Services → Library**.
2. Search for **Gmail API**.
3. Click **Enable**.

---

## 3. Configure OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** (to test with personal Gmail accounts).
3. Fill in the required fields:
   - **App name:** `App Name`
   - **User support email:** your email
4. Add your email as a **test user** under "Test users".
5. Save and continue.

---

## 4. Create OAuth 2.0 Credentials
1. Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**.
2. Choose **Web application**.
3. Give it a name, e.g., `Nodemailer Client`.
4. Set the **Authorized redirect URIs**:
   - Development: `http://localhost:3000/oauth2callback`
   - Production: `https://yourdomain.com/oauth2callback`
5. Click **Create**.
6. Copy the **Client ID** and **Client Secret** — these will go into your `.env`.

---

## 5. Generate Refresh Token
1. Install dependencies if not done yet:
   ```bash
   npm install googleapis dotenv
   ```
2. Make sure `.env` has:
   ```env
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```
3. Run the script `get-refresh-token.mjs`:
   ```bash
   node app/scripts/get-refresh-token.mjs
   ```
4. It will print an authorization URL. Open it in your browser.
5. Log in with the Gmail account you want to use and **allow access**.
6. After authorization, Google will redirect you to:
   ```
   http://localhost:3000/oauth2callback?code=4/XYZ...
   ```
7. Copy the `code` value from the URL.
8. Paste the code into `get-refresh-token.mjs` in the line:
   ```js
   const code = "PASTE_THE_CODE_FROM_GOOGLE_HERE";
   ```
9. Run the script again:
   ```bash
   node app/scripts/get-refresh-token.mjs
   ```
10. The console will print a **refresh token**.
11. Copy it into `.env`:
    ```env
    GOOGLE_REFRESH_TOKEN=1//0abcdef...
    ```
12. Optionally, delete the `code` line afterwards to avoid exposing sensitive data.

---

## 6. Use Refresh Token in Nodemailer
1. Configure Nodemailer with OAuth2:
   ```ts
   const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       type: "OAuth2",
       user: process.env.EMAIL_USER,
       clientId: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
     },
   });
   ```
2. You can now send emails without storing your Gmail password.

---

## Notes
- The `redirect_uri` must match exactly what you added in Google Cloud Console, i.e., http://localhost:3000/oauth2callback, which is also used in our script.
