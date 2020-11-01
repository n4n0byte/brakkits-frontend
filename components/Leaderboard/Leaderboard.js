import withAuth from "@okta/okta-react/dist/withAuth";
import { MDBCard, MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import "../../App.css";
import Nav from "../General/Nav";
import SpinnyBoi from "../General/SpinnyBoi";

export default withAuth(function Leaderboard(props) {
  let [responseData, setResponseData] = useState(null);
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [transformedData, setTransformedData] = useState([]);

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

  // get rankings
  useEffect(() => {
    async function leaderboard() {
      const response = await fetch(`http://localhost:8080/leaderboard`, {
        method: "GET",
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`
        })
      }).catch(e => console.log(e));
      const json = await response.json();
      console.log(json);
      console.log(accessToken);
      setResponseData(json);
    }
    if (authenticated) {
      leaderboard();
    }
  }, [accessToken]);

  let header = [
    {
      label: "Tag",
      field: "tag",
      sort: "asc"
    },
    {
      label: "Rank",
      field: "placement",
      sort: "asc"
    },
    {
      label: "Events Attended",
      field: "eventsAttended",
      sort: "asc"
    },
    {
      label: "Wins",
      field: "winCount",
      sort: "asc"
    },
    {
      label: "Losses",
      field: "lossCount",
      sort: "asc"
    },
    {
      label: "W/L Ratio",
      field: "winLossRatio",
      sort: "asc"
    }
  ];

  useEffect(() => {
    if (responseData) {
      setTransformedData(
        responseData.data.map(user => ({
          tag: user.tag,
          placement: user.placement,
          eventsAttended: user.eventsAttended,
          lossCount: user.lossCount,
          winCount: user.winCount,
          winLossRatio: user.winLossRatio
        }))
      );
      console.log(transformedData);
    }
  }, [responseData]);

  // contains info for data table to be populated
  let tableData = { columns: header, rows: transformedData };
  let dstyles = {
    width: "80vw",
    height: "40vh"
  };

  return (
    <>
      <Nav links={[["Home", "/"]]} />

      <div className="container pt-5">
        <MDBCard>
          {responseData ? (
            <MDBDataTable
              striped
              hoverable
              maxHeight="30vh"
              scrollY
              fixed
              data={tableData}
              className="px-2"
            />
          ) : (
            <SpinnyBoi pos={5} />
          )}
        </MDBCard>
      </div>
    </>
  );
});
