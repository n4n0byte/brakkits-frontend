import React, { useState, useEffect } from "react";
import * as OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";

export default function LoginForm(props) {
  const { pkce, issuer, clientId, redirectUri, scopes } = props.config;
  let [signIn, setSignIn] = useState(
    new OktaSignIn({
      baseUrl: issuer.split("/oauth2")[0],
      clientId,
      redirectUri,
      logo:
        "https://www.stickpng.com/assets/images/584830f5cef1014c0b5e4aa1.png",
      i18n: {
        en: {
          "primaryauth.title": "Brakkits Sign In"
        }
      },
      features: {
        registration: true, // Enable self-service registration flow
        rememberMe: true, // Setting to false will remove the checkbox to save username
        multiOptionalFactorEnroll: true, // Allow users to enroll in multiple optional factors before finishing the authentication flow.
        selfServiceUnlock: true, // Will enable unlock in addition to forgotten password
        smsRecovery: false, // Enable SMS-based account recovery
        callRecovery: false, // Enable voice call-based account recovery
        router: false // Leave this set to true for the API demo
      },
      authParams: {
        pkce,
        issuer,
        display: "page",
        scopes: ["openid", "profile"]
      }
    })
  );

  useEffect(() => {
    signIn.renderEl(
      { el: "#sign-in-widget" },
      () => {},
      err => {
        throw err;
      }
    );
  }, []);

  return (
    <div className="container">
      <div id="sign-in-widget" />
    </div>
  );
}
