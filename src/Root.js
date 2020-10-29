import "./App.css";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import MyEvents from "./components/MyEvents/MyEvents";
import ShowEvent from "./components/EventStatus/ShowEvent";
import EventDetails from "./components/General/EventDetails";
import Error from "./components/General/Error"
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";
import React, { useState, useEffect } from "react";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 *
 * Application Root
 **/

import {
  Security,
  ImplicitCallback,
  SecureRoute,
  LoginCallback,
} from "@okta/okta-react";
import {
  useHistory,
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import "mdbreact";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

const config = {
  issuer: "https://dev-436597.okta.com/oauth2/default",
  redirectUri: window.location.origin + "/implicit/callback/",
  clientId: "0oa2sicvzyRGNFKaN4x6",
  pkce: true,
  responseType: ["id_token", "token"],
  features: {
    registration: true, // Enable self-service registration flow
    rememberMe: true, // Setting to false will remove the checkbox to save username
    multiOptionalFactorEnroll: false, // Allow users to enroll in multiple optional factors before finishing the authentication flow.
    selfServiceUnlock: true, // Will enable unlock in addition to forgotten password
    smsRecovery: false, // Enable SMS-based account recovery
    callRecovery: false, // Enable voice call-based account recovery
    router: true, // Leave this set to true for the API demo
  },
};

export default withOktaAuth(function Root() {
  const [eventName, setEventName] = useState("Default");
  const [loggedIn, setLoggedIn] = useState(true);

  // redirects to login view if unauthenticated
  const history = useHistory();

  const onAuthRequired = () => {
    history.push("/login");
  };

  return (
    <div className="App">
      {/*Application Routing*/}
      <Switch>
        <Security {...config} onAuthRequired={onAuthRequired}>
          <SecureRoute path="/" exact component={Home} />
          <SecureRoute path="/showEvent/:eventName" component={ShowEvent} />
          <SecureRoute
            path="/eventDetails/:eventName"
            component={EventDetails}
          />

          <SecureRoute path="/myEvents/" component={MyEvents} />
          <SecureRoute path="/leaderboard" component={Leaderboard} />
          <Route path="/login" render={() => <Login config={config} />} />
          <Route path="/implicit/callback" component={LoginCallback} />
          <Route path="/error" component={Error} />
        </Security>
      </Switch>
    </div>
  );
});
