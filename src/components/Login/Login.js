import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import Nav from "../General/Nav";
import * as OktaSignIn from "@okta/okta-signin-widget";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import "@okta/okta-signin-widget/dist/css/okta-sign-in.min.css";
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

import { MDBContainer } from "mdbreact";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Login/Registration component
 */
export default withOktaAuth(function Login(props) {
  const [authenticated, setAuthenticated] = useState(null);

  // updates authentication variable
  useEffect(() => {
    async function checkAuthentication() {
      const isAuthenticated = await props.authState.isAuthenticated;
      if (isAuthenticated !== authenticated) {
        setAuthenticated(isAuthenticated);
      }
    }

    checkAuthentication();
    console.log(authenticated + ": local ");
  }, [authenticated]);

  return (
    <>
      <Nav />
      <MDBContainer className={"mh-75"}>
        <LoginForm config={props.config} />
      </MDBContainer>
    </>
  );
});
