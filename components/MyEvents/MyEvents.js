import withAuth from "@okta/okta-react/dist/withAuth";
import { MDBCard, MDBContainer, MDBRow } from "mdbreact";
import React, { useEffect, useState } from "react";
import Nav from "../General/Nav";
import SpinnyBoi from "../General/SpinnyBoi";
import AttendedEvents from "./AttendedEvents";
import CreatedEventsList from "./CreatedEventsList";

export default withAuth(function MyEvents(props) {
  let [createdEvents, setCreatedEvents] = useState(null);
  let [attendedEvents, setAttendedEvents] = useState(null);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [refresh, setRefresh] = useState(false);

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

  /**
   * query api for  events created by this user
   */
  async function getCreatedEvents() {
    if (authenticated) {
      const response = await fetch(`http://localhost:8080/findEventsCreated/`, {
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
        `http://localhost:8080/findEventsAttended/`,
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
