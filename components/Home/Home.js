import React, { useEffect, useState } from "react";
import "../../App.css";
import EventCard from "../General/EventCard";
import { MDBCol, MDBContainer, MDBRow, MDBCard } from "mdbreact";
import LoadingSpin from "react-loading-spin";
import Search from "./Search";
import Nav from "../General/Nav";
import withAuth from "@okta/okta-react/dist/withAuth";
import SpinnyBoi from "../General/SpinnyBoi";

/**
 * Home View
 */
export default withAuth(function Home(props) {
  const [eventList, setEventList] = useState();
  const [maxEvents, setMaxEvents] = useState(100);
  const [searchInput, setSearchInput] = useState("");
  const [authenticated, setAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [sentUser, setSentUser] = useState(false);

  // set Authentication
  useEffect(() => {
    async function checkAuthentication() {
      const isAuthenticated = await props.auth.isAuthenticated();

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
        const tempUser = await props.auth.getUser();
        const tempIdToken = await props.auth.getIdToken();
        const tempAccessToken = await props.auth.getAccessToken();

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
      const response = await fetch(`http://localhost:8080/storeUser`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`
        })
      }).catch(e => console.log(e));
      const json = await response.json().catch(e => console.log(e));
      console.log(json);
      setSentUser(true);
    }

    storeUser();
  }, [accessToken]);

  /**
   * queries the rest api for events
   */
  async function getEventListings() {
    if (authenticated) {
      console.log(accessToken);
      const response = await fetch(
        `http://localhost:8080/getTopEvents/${maxEvents}`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`
          })
        }
      );

      const json = await response.json();
      console.log(json);
      setEventList(json);
    }
  }

  // show all event cards
  useEffect(() => {
    getEventListings();
  }, [accessToken]);

  // update cards with search query
  useEffect(() => {
    async function searchEventListings() {
      // show original set of events when
      // nothing is being searched for
      if (!searchInput || searchInput.length0 === 0) {
        getEventListings();
        return;
      }

      const response = await fetch(
        `http://localhost:8080/findEvents?eventName=${searchInput}`,
        {
          headers: new Headers({
            method: "GET",
            Authorization: `Bearer ${accessToken}`
          })
        }
      ).catch(e => console.log(e));
      const json = await response.json().catch(e => console.log(e));
      setEventList(json);
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
        />
      </MDBCol>
    ));
  }

  return (
    <div>
      <Nav
        links={[
          ["Leaderboard", "/leaderboard"],
          ["My Events", "/myEvents"]
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
