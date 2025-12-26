import React from "react";

const Docs = () => {
  return (
    <div className="min-h-screen bg-black text-[#F7F4ED] p-8 md:p-16">
      <div className="max-w-5xl mx-auto space-y-12">

      
        <header>
          <h1 className="text-4xl font-bold mb-4">JAuth OAuth 2.0 Integration Guide</h1>
          <p className="text-gray-300 text-lg">
            This document explains how third-party applications can authenticate users using
            <b> JAuth OAuth 2.0 Authorization Code Flow</b>.
          </p>
        </header>

       
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300 mb-4">
            JAuth follows the standard OAuth 2.0 Authorization Code flow.
            The user authenticates on JAuth, your backend exchanges a code for tokens,
            and then fetches user data.
          </p>

          <pre className="bg-[#111] p-4 rounded-lg text-sm overflow-x-auto">
{`Third-Party App (Browser)
      ↓
JAuth Login / Signup UI
      ↓
Authorization Code
      ↓
Third-Party Backend
      ↓
Access Token + Refresh Token
      ↓
Fetch User Profile`}
          </pre>
        </section>


        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 1 — Redirect User to JAuth</h2>

          <p className="text-gray-300 mb-4">
            Redirect the user from your frontend to JAuth to start authentication.
          </p>

          <div className="bg-[#111] p-4 rounded-lg space-y-2 text-sm">
            <p><b>Endpoint</b></p>
            <code>GET /oauth/authorize</code>

            <p className="mt-4"><b>Query Parameters</b></p>
            <ul className="list-disc ml-6 text-gray-300">
              <li><code>client_id</code> – Your OAuth client ID</li>
              <li><code>redirect_uri</code> – Callback URL registered in JAuth</li>
              <li><code>response_type</code> – Must be <code>code</code></li>
              <li><code>scope</code> – Optional (e.g. <code>profile email</code>)</li>
              <li><code>state</code> – Optional (recommended for CSRF protection)</li>
            </ul>

            <p className="mt-4"><b>Example</b></p>
            <pre className="overflow-x-auto">
{`https://jauth.jagadesh31.tech/oauth/authorize
?response_type=code
&client_id=YOUR_CLIENT_ID
&redirect_uri=https://yourapp.com/auth/callback
&scope=profile email
&state=random_string`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Step 2 — Receive Authorization Code
          </h2>

          <p className="text-gray-300 mb-4">
            After successful login, JAuth redirects the user back to your
            <code> redirect_uri</code> with a short-lived authorization code.
          </p>

          <pre className="bg-[#111] p-4 rounded-lg text-sm overflow-x-auto">
{`https://yourapp.com/auth/callback?code=AUTH_CODE&state=random_string`}
          </pre>

          <ul className="list-disc ml-6 text-gray-300 mt-4">
            <li>Authorization code is single-use</li>
            <li>Expires in ~60 seconds</li>
            <li>Validate <code>state</code> if used</li>
          </ul>
        </section>


        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Step 3 — Exchange Code for Tokens (Backend)
          </h2>

          <p className="text-gray-300 mb-4">
            Exchange the authorization code for tokens from your backend.
            <b> Never do this from the frontend.</b>
          </p>

          <div className="bg-[#111] p-4 rounded-lg text-sm space-y-3">
            <p><b>Endpoint</b></p>
            <code>POST /oauth/getToken</code>

            <p><b>Request Body</b></p>
            <pre className="overflow-x-auto">
{`{
  "code": "AUTH_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://yourapp.com/auth/callback"
}`}
            </pre>

            <p><b>Response</b></p>
            <pre className="overflow-x-auto">
{`{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 900
}`}
            </pre>
          </div>
        </section>


        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Step 4 — Fetch User Information
          </h2>

          <p className="text-gray-300 mb-4">
            Use the access token to fetch the authenticated user's profile.
          </p>

          <div className="bg-[#111] p-4 rounded-lg text-sm space-y-3">
            <p><b>Endpoint</b></p>
            <code>GET /oauth/getUser</code>

            <p><b>Headers</b></p>
            <pre>
{`Authorization: Bearer ACCESS_TOKEN`}
            </pre>

            <p><b>Response</b></p>
            <pre className="overflow-x-auto">
{`{
  "_id": "64fd8c1e...",
  "email": "user@example.com",
  "username": "jaga",
  "createdAt": "2024-09-01T12:20:00Z"
}`}
            </pre>
          </div>
        </section>


        <section>
          <h2 className="text-2xl font-semibold mb-4">Security Notes</h2>
          <ul className="list-disc ml-6 text-gray-300 space-y-2">
            <li>Never expose <code>client_secret</code> in frontend</li>
            <li>Authorization codes are single-use</li>
            <li>Always use HTTPS in production</li>
            <li>Store tokens securely on backend</li>
          </ul>
        </section>

     
        <section>
          <h2 className="text-2xl font-semibold mb-4">Flow Summary</h2>
          <pre className="bg-[#111] p-4 rounded-lg text-sm overflow-x-auto">
{`1. Redirect user → /oauth/authorize
2. Receive ?code=...
3. POST /oauth/getToken (backend)
4. GET /oauth/getUser
5. User authenticated`}
          </pre>
        </section>

      </div>
    </div>
  );
};

export default Docs;
