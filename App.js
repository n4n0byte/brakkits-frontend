import React, { useState } from "react";
import "./App.css";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import MyEvents from "./components/MyEvents/MyEvents";
import ShowEvent from "./components/EventStatus/ShowEvent";
import { Security, ImplicitCallback, SecureRoute } from "@okta/okta-react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router";
import "mdbreact";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import Particles from "react-particles-js";

const config = {
  issuer: "https://dev-436597.okta.com/oauth2/default",
  redirectUri: window.location.origin + "/implicit/callback/",
  clientId: "0oa2sicvzyRGNFKaN4x6",
  pkce: true,
  responseType: ["id_token", "token"],
  features: {
    registration: true, // Enable self-service registration flow
    rememberMe: true, // Setting to false will remove the checkbox to save username
    multiOptionalFactorEnroll: true, // Allow users to enroll in multiple optional factors before finishing the authentication flow.
    selfServiceUnlock: true, // Will enable unlock in addition to forgotten password
    smsRecovery: false, // Enable SMS-based account recovery
    callRecovery: false, // Enable voice call-based account recovery
    router: true // Leave this set to true for the API demo
  }
};

/**
 * App
 * @returns {*} Root Application
 * @constructor
 */
export default function App() {
  // redirects to login view if unauthenticated
  function bootEmOut({ history }) {
    history.push("/login");
  }

  const [eventName, setEventName] = useState("Default");
  const [loggedIn, setLoggedIn] = useState(true);

  // route definitions
  return (
    <Router>
      <div className="App">
        {/*Application Routing*/}
        <Switch>
          <Security {...config} onAuthRequired={bootEmOut}>
            <SecureRoute path="/" exact component={Home} />
            <SecureRoute
              path="/showEvent/:eventName"
              render={() => <ShowEvent />}
            />
            <SecureRoute path="/myEvents/" render={() => <MyEvents />} />
            <SecureRoute path="/leaderboard" render={() => <Leaderboard />} />
            <Route path="/login" render={() => <Login config={config} />} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
          </Security>
        </Switch>
      </div>
    </Router>
  );
}
