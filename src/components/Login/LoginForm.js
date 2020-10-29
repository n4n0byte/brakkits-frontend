import React, { useState, useEffect } from "react";
import * as OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Login okta widget wrapper
 */
export default withOktaAuth(function (props) {
  const { pkce, issuer, clientId, redirectUri, scopes } = props.config;

  let signInWidget = new OktaSignIn({
    baseUrl: issuer.split("/oauth2")[0],
    clientId,
    redirectUri,
    logo: "https://www.stickpng.com/assets/images/584830f5cef1014c0b5e4aa1.png",

    i18n: {
      en: {
        "primaryauth.title": "Brakkits Sign In",
      },
    },
    registration: {
      parseSchema: function (schema, onSuccess, onFailure) {
        // handle parseSchema callback
        onSuccess(schema);
      },
      preSubmit: function (postData, onSuccess, onFailure) {
        // handle preSubmit callback
        onSuccess(postData);
      },
      postSubmit: function (response, onSuccess, onFailure) {
        // handle postsubmit callback
        console.log(response);
        onSuccess(response);
      },
    },
    features: {
      registration: true, // Enable self-service registration flow
      rememberMe: true, // Setting to false will remove the checkbox to save username
      multiOptionalFactorEnroll: true, // Allow users to enroll in multiple optional factors before finishing the authentication flow.
      selfServiceUnlock: true, // Will enable unlock in addition to forgotten password
      smsRecovery: true, // Enable SMS-based account recovery
      callRecovery: true, // Enable voice call-based account recovery
      router: false, // Leave this set to true for the API demo
    },
    authParams: {
      pkce,
      issuer,
      display: "page",
      scopes: ["openid", "profile",  "email"],
    },
  });
  // );

  useEffect(() => {
    console.log(props.config);
    console.log(signInWidget);

    signInWidget.renderEl(
      { el: "#sign-in-widget" },
      (res) => {
        var key = "";
        if (res[0]) {
          key = Object.keys(res[0])[0];
          signInWidget.tokenManager.add(key, res[0]);
        }
        if (res[1]) {
          key = Object.keys(res[1])[0];
          signInWidget.tokenManager.add(key, res[1]);
        }
        if (res.status === "SUCCESS") {
          var token = signInWidget.tokenManager.get(key);
          console.log("Logged in to Okta and issued token:");
          console.log(token);
          console.log("Reload this page to start over.");
          alert("Logged in! Check your developer console for details");
        }
      },
      (err) => {
        console.log(err);
        // throw err;
      }
    );
  }, []);

  return (
    <div className="container">
      <div id="sign-in-widget" />
    </div>
  );
});
