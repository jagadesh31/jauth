import React from 'react';

const Docs = () => (
  <div className="docs-container bg-black text-[#F7F4ED] min-h-screen p-8">
    <h1 className="text-3xl font-bold mb-6">Jauth API Documentation</h1>
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">OAuth Endpoints</h2>
      <ul className="list-disc ml-6">
        <li><b>GET /oauth/authorize</b>: Initiate OAuth flow. Params: <code>client_id</code>, <code>redirect_uri</code>, <code>response_type</code>, <code>scope</code></li>
        <li><b>GET /oauth/getCode</b>: Get authorization code. Params: <code>userId</code></li>
        <li><b>POST /oauth/getToken</b>: Exchange code for tokens. Body: <code>code</code>, <code>client_id</code>, <code>client_secret</code>, <code>redirect_uri</code></li>
        <li><b>GET /oauth/getUser</b>: Get user info (requires access token in cookie)</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">User Endpoints</h2>
      <ul className="list-disc ml-6">
        <li><b>POST /user/register</b>: Register a new user. Body: <code>email</code>, <code>username</code>, <code>password</code></li>
        <li><b>POST /user/login</b>: Login user. Body: <code>email</code>, <code>password</code></li>
        <li><b>GET /user/userInfo</b>: Get current user info (requires access token in cookie)</li>
        <li><b>GET /user/getApps</b>: List user's OAuth apps</li>
        <li><b>POST /user/credentials/create</b>: Create OAuth app credentials</li>
        <li><b>PUT /user/credentials/:id</b>: Update app credentials</li>
        <li><b>DELETE /user/credentials/:id</b>: Delete app credentials</li>
        <li><b>POST /user/credentials/:id/regenerate-secret</b>: Regenerate client secret</li>
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-2">Authentication</h2>
      <ul className="list-disc ml-6">
        <li>Tokens are sent via <b>httpOnly cookies</b> for security.</li>
        <li>Access token is required for all protected endpoints.</li>
        <li>Refresh token is used for session renewal (endpoint coming soon).</li>
      </ul>
    </section>
    <section>
      <h2 className="text-2xl font-semibold mb-2">OAuth Flow Example</h2>
      <ol className="list-decimal ml-6">
        <li>App redirects user to <b>/oauth/authorize</b> with required params.</li>
        <li>User authenticates and authorizes app.</li>
        <li>App exchanges code for tokens via <b>/oauth/getToken</b>.</li>
        <li>Tokens are set in cookies; app can call <b>/oauth/getUser</b> to get user info.</li>
      </ol>
    </section>
  </div>
);

export default Docs;