import { useParams } from "react-router";
import Nav from "../General/Nav";
import LoadingSpin from "react-loading-spin";
import React, { useState, useEffect, useCallback } from "react";
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

import {
  useHistory,
} from "react-router-dom";


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
  const history = useHistory();

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


  const deleteEvent = useCallback(() => {
    async function deleteEvent() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/deleteEvent/${props.eventName}`,
        {
          headers: new Headers({
            method: "post",
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      ).catch((e) => console.log(e));
      const json = await response.json().catch((e) => console.log(e));
      history.push("/");
      console.log(json);
    }
    if (accessToken) {
      deleteEvent();
    }
  }, [accessToken]);

  const enterEvent = useCallback(() => {
    async function enterEvent() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/joinEvent/${props.eventName}`,
        {
          headers: new Headers({
            method: "POST",
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      )      
      const json = await response.json().catch((e) => console.log(e));
      // history.push("/");
      console.log(json);
    }
    if (accessToken) {
      enterEvent();
    }
  }, [accessToken]);


  // function enterEvent(){
  //   if (accessToken) {
  //     fetch(
  //       `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/joinEvent/${props.eventName}`,
  //       {
  //         headers: new Headers({
  //           method: "POST",
  //           Authorization: `Bearer ${accessToken}`,
  //         }),
  //       }
  //     )      
  //     .catch((e) => console.log(e));      
  //   }
    
  // }

  // get privs
  useEffect(() => {
    async function getPrivs() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/checkEventPrivilege/${props.eventName}`,
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


  

  return (
    <div className="row ">
      <div className="mx-auto">
        {eventPrivs ? (
          !eventPrivs.isEnteredIntoTournament ? (
            <button
              className="btn btn-primary"
              onClick={enterEvent}
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
            <button onClick={deleteEvent} className="btn btn-danger">Delete Tournament</button>
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
