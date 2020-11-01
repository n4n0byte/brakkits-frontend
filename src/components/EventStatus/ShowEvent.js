import React, { useState } from "react";
import { useParams } from "react-router";
import Event from "../General/Event";
import Nav from "../General/Nav";
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Displays an event
 */
export default withOktaAuth(function ShowEvent(props) {
  const { eventName } = useParams();
  const [bracketData, setBracketData] = useState([]);

  return (
    <>
      <Nav links={[["Home", "/"]]} />
      <div className="container">
        <Event />
      </div>
    </>
  );
})