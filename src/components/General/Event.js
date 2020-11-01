import { MDBCard, MDBCardBody, MDBCardTitle } from "mdbreact";
import { ReactTournament } from "react-tournament";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import LoadingSpin from "react-loading-spin";
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Displays Events in either the active or inactive state
 */
export default withOktaAuth(function Event(props) {
  const { eventName } = useParams();
  const [bracketData, setBracketData] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);

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

  // check if tournament is active
  useEffect(() => {
    async function checkActive() {
      console.log(accessToken + " TOKEN");
      const response = await fetch(
        `http://localhost:8080/checkEventStatus/${eventName}`,
        {
          headers: new Headers({
            method: "GET",
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      ).catch((e) => console.log(e));
      const json = await response.json().catch((e) => console.log(e));
      console.log(json.data);
    }
    if (accessToken != null) {
      checkActive();
    }
  }, [accessToken]);

  // fetch bracket
  useEffect(() => {
    async function getBracket() {
      const response = await fetch(
        `http://localhost:8080/getEventBracket/${eventName}`,
        {
          headers: new Headers({
            method: "GET",
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      ).catch((e) => console.log(e));
      const json = await response.json().catch((e) => console.log(e));
      console.log(json)
      setBracketData(json);
    }
    getBracket();
  }, [accessToken]);

  return (
    <MDBCard className="p-4 ">
      <MDBCardTitle className="justify-content-center">
        {eventName}
      </MDBCardTitle>

      <div className="row">
        <div className="col-lg-2"></div>

        <div className="col-lg-8">
          <MDBCardBody>
            {bracketData === undefined || bracketData == null ? (
              <LoadingSpin />
            ) : (
              <ReactTournament
                aspectRatio={1}
                width={4}
                data={bracketData.data.rounds}
              />
            )}
          </MDBCardBody>
        </div>
      </div>
    </MDBCard>
  );
});
