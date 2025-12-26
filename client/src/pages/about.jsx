import React from 'react';

const About = () => (
  <div className="about-container bg-black text-[#F7F4ED] min-h-screen p-8">
    <h1 className="text-3xl font-bold mb-6">About Jauth</h1>
    <p className="mb-4 text-lg max-w-2xl">
      <b>Jauth</b> is a modern authentication and OAuth 2.0 server designed for developers who want to add secure login and authorization to their apps. It provides a simple, secure, and developer-friendly way to manage users, issue tokens, and integrate with third-party applications.
    </p>
    <ul className="list-disc ml-6 mb-6">
      <li>Secure authentication with JWT and httpOnly cookies</li>
      <li>OAuth 2.0 Authorization Code flow</li>
      <li>User registration, login, and app management</li>
      <li>Easy integration for client apps</li>
      <li>API documentation and example flows</li>
    </ul>
    <p className="max-w-2xl">
      Built with Node.js, Express, MongoDB, and React. <br/>
    </p>
  </div>
);

export default About;