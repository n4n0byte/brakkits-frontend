import React, { useState } from "react";
import { useParams } from "react-router";
import Event from "../General/Event";
import Nav from "../General/Nav";

/**
 * Displays an event
 */
function ShowEvent(props) {
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
}

export default ShowEvent;
