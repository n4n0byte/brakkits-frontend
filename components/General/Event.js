import { MDBCard, MDBCardBody, MDBCardTitle } from "mdbreact";
import { ReactTournament } from "react-tournament";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import LoadingSpin from "react-loading-spin";
import withAuth from "@okta/okta-react/dist/withAuth";

/**
 * Displays Events in either the active or inactive state
 */
export default withAuth(function Event(props) {
  const { eventName } = useParams();
  const [bracketData, setBracketData] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // set Authentication
  useEffect(() => {
    async function checkAuthentication() {
      const isAuthenticated = await props.auth.isAuthenticated();

      if (isAuthenticated !== authenticated) {
        const tempAccessToken = await props.auth.getAccessToken();
        setAuthenticated(isAuthenticated);
        setAccessToken(tempAccessToken);
      }
    }

    checkAuthentication();
  }, [authenticated]);

  // check if tournament is active
  useEffect(() => {
    async function getBracket() {
      const response = await fetch(
        `http://localhost:8080/checkEventStatus/${eventName}`,
        {
          headers: new Headers({
            method: "GET",
            Authorization: `Bearer ${accessToken}`
          })
        }
      ).catch(e => console.log(e));
      const json = await response.json();
      console.log(json);
    }
    getBracket();
  }, [accessToken]);

  useEffect(() => {
    async function getBracket() {
      const response = await fetch(
        `http://localhost:8080/getEventBracket/${eventName}`,
        {
          headers: new Headers({
            method: "GET",
            Authorization: `Bearer ${accessToken}`
          })
        }
      ).catch(e => console.log(e));
      const json = await response.json();
      setBracketData(json);
      // console.log(bracketData);
    }
    getBracket();
  }, [accessToken]);

  return (
    <MDBCard className="p-4 ">
      <MDBCardTitle className="justify-content-center">
        {eventName}
      </MDBCardTitle>
      <MDBCardBody>
        {bracketData === undefined || bracketData == null ? (
          <LoadingSpin />
        ) : (
          <ReactTournament aspectRatio={4} width={1} data={bracketData.data} />
        )}
      </MDBCardBody>
    </MDBCard>
  );
});
