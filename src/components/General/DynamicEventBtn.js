import { useParams } from "react-router";
import Nav from "../General/Nav";
import LoadingSpin from "react-loading-spin";
import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCol,
  MDBBtn,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCardBody,
  MDBNavLink,
} from "mdbreact";

import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Button Component that dynamically changes sign-up to bracket view when an event has started   
 */

export default withOktaAuth(function DynamicBtn(props) {
  const [authenticated, setAuthenticated] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [eventPrivs, setEventPrivs] = useState(null);

  // set Authentication
  useEffect(() => {
    async function checkAuthentication() {
      const isAuthenticated = await props.authState.isAuthenticated;

      if (isAuthenticated !== authenticated) {
        setAuthenticated(isAuthenticated);
      }
    }

    checkAuthentication();
  }, [authenticated]);

  // get tokens
  useEffect(() => {
    async function getTokens() {
      if (authenticated) {
        const tempUser = await props.authState.user;
        const tempIdToken = await props.authState.idToken;
        const tempAccessToken = await props.authState.accessToken;
        console.log(tempAccessToken);
        setIdToken(tempIdToken);
        setAccessToken(tempAccessToken);
      } else {
        console.log("NOT AUTH");
        setUser(null);
      }
    }
    getTokens();
  }, [authenticated]);

  // get stagelist
  useEffect(() => {
    async function getPrivs() {
      const response = await fetch(
        `http://localhost:8080/checkEventPrivilege/${props.eventName}`,
        {
          headers: new Headers({
            method: "GET",
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      ).catch((e) => console.log(e));
      const json = await response.json().catch((e) => console.log(e));
      setEventPrivs(json.data);
      console.log(json.data);
    }
    if (accessToken) {
      getPrivs();
    }
  }, [accessToken]);

  function toggleEntry() {}

  return (
    <div className="row ">
      <div className="mx-auto">
        {eventPrivs ? (
          !eventPrivs.isEnteredIntoTournament ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                alert();
              }}
            >
              Enter Tournament
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => {}}>
              Leave Tournament
            </button>
          )
        ) : (
          <LoadingSpin />
        )}
      </div>
      {eventPrivs ? (
        eventPrivs.owner ? (
          <div className="mx-auto">
            <button className="btn btn-danger">Delete Tournament</button>
          </div>
        ) : (
          <></>
        )
      ) : (
        <LoadingSpin />
      )}
    </div>
  );
});
