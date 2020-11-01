import React, { useEffect, useState } from "react";
import "../../App.css";
import EventCard from "../General/EventCard";
import { MDBCol, MDBContainer, MDBRow, MDBCard } from "mdbreact";
import LoadingSpin from "react-loading-spin";
import Search from "./Search";
import Nav from "../General/Nav";
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";
import SpinnyBoi from "../General/SpinnyBoi";

import {
  useHistory,
} from "react-router-dom";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Home View
 */
export default withOktaAuth(function Home(props) {
  const [eventList, setEventList] = useState();
  const [maxEvents, setMaxEvents] = useState(100);
  const [searchInput, setSearchInput] = useState("");
  const [authenticated, setAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [sentUser, setSentUser] = useState(false);
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

        setUser(tempUser);
        setIdToken(tempIdToken);
        setAccessToken(tempAccessToken);
      } else {
        setUser(null);
      }
    }
    getTokens();
  }, [authenticated]);

  // update cards with search query
  useEffect(() => {
    async function storeUser() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/storeUser`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      }).then(
        (response) => {         
          setSentUser(true);
        }        
      )
      .catch((e) => {
        console.log(e + "ERROR CAUGHT");
      })
    }

    storeUser();
  }, [accessToken]);



  /**
   * queries the rest api for events
   */
  async function getEventListings() {
    if (authenticated) {
      try{
      console.log(accessToken);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/getTopEvents/${maxEvents}`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      );

      const json = await response.json();
      console.log(json);
      if (json.statusCode != 200) throw json.message;

      setEventList(json);
    } catch (err){
      history.push({
        pathname: '/error',
        state: { error: err }
      })
    }
    }
  }

  // show all event cards
  useEffect(() => {
    getEventListings();
  }, [accessToken]);

  // update cards with search query
  useEffect(() => {
    async function searchEventListings() {

      try{
      // show original set of events when
      // nothing is being searched for
      if (!searchInput || searchInput.length0 === 0) {
        getEventListings();
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/findEvents?eventName=${searchInput}`,
        {
          headers: new Headers({
            method: "GET",
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      ).catch((e) => console.log(e));
      const json = await response.json().catch((e) => console.log(e));
      setEventList(json);
    } catch(err){
      console.log(err)
      history.push({
        pathname: '/error',
        state: { error: "Backend is down" }
      })
    }
  }
    searchEventListings();
  }, [searchInput, accessToken]);

  /**
   * builds a list of cards
   * for the main event view
   */
  function buildEventCards() {
    return eventList.data.map((event, index) => (
      <MDBCol className="col-12 col-md-6 col-lg-4 mt-3" key={index}>
        <EventCard
          key={index}
          event={event}
          eventName={event.title}
          description={event.description}
          eventDate={event.startDate}
          imgLink={event.imgUrl}
          isActive={event.isActive}
        />
      </MDBCol>
    ));
  }

  return (
    <div>
      <Nav
        links={[
          ["Leaderboard", "/leaderboard"],
          ["My Events", "/myEvents"],
        ]}
      />

      <MDBContainer className={"pt-2"}>
        <MDBCard>
          <Search searchInput={searchInput} setSearchInput={setSearchInput} />
          {eventList == undefined ? (
            // list not loaded
            <SpinnyBoi />
          ) : (
            // list loaded
            <MDBRow className={"pt-1"}>{buildEventCards(eventList)}</MDBRow>
          )}
        </MDBCard>
      </MDBContainer>
    </div>
  );
});
