import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

import { MDBCard, MDBContainer, MDBRow } from "mdbreact";
import React, { useEffect, useState } from "react";
import Nav from "../General/Nav";
import SpinnyBoi from "../General/SpinnyBoi";
import AttendedEvents from "./AttendedEvents";
import CreatedEventsList from "./CreatedEventsList";


/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Top Level event component, displays both attended and created events
 */
export default withOktaAuth(function MyEvents(props) {
  let [createdEvents, setCreatedEvents] = useState(null);
  let [attendedEvents, setAttendedEvents] = useState(null);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // set Authentication
  useEffect(() => {
    async function checkAuthentication() {
      const isAuthenticated = await props.authState.isAuthenticated;

      if (isAuthenticated !== authenticated) {
        const tempAccessToken = await props.authState.accessToken;
        setAuthenticated(isAuthenticated);
        setAccessToken(tempAccessToken);
      }
    }

    checkAuthentication();
  }, [authenticated]);

  /**
   * query api for  events created by this user
   */
  async function getCreatedEvents() {
    if (authenticated) {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/findEventsCreated/`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`
        })
      });
      const json = await response.json();
      console.log(json);

      setCreatedEvents(json);
    }
  }

  /**
   * query api for  events created by this user
   */
  async function getAttendedEvents() {
    if (authenticated) {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/findEventsAttended/`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`
          })
        }
      );

      const json = await response.json();
      console.log(json);
      setAttendedEvents(json);
    }
  }

  // show all event cards
  useEffect(() => {
    getCreatedEvents();
    getAttendedEvents();
  }, [accessToken, refresh]);

  return (
    <>
      <Nav />
      <MDBContainer className="mt-4">
        <MDBCard className="p-3">
          {createdEvents === undefined ? (
            <SpinnyBoi pos={5} />
          ) : (
            <MDBRow>
              <CreatedEventsList
                responseData={createdEvents}
                setResponseData={setCreatedEvents}
                accessToken={accessToken}
                refresh={refresh}
                setRefresh={setRefresh}
              />
              <div className="col-2"></div>
              <AttendedEvents
                refresh={refresh}
                setRefresh={setRefresh}
                responseData={attendedEvents}
                setResponseData={setAttendedEvents}
              />
            </MDBRow>
          )}
        </MDBCard>
      </MDBContainer>
    </>
  );
});
