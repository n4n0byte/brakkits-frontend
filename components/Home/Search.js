import React, { useEffect, useState } from "react";
import { MDBInput } from "mdbreact";

/**
 * searches for items
 * @param {props.setSearchInput: String} props
 */
function Search(props) {
  return (
    <input
      style={{ position: "floating" }}
      className="form-control col-8 offset-2 mt-3"
      onChange={e => {
        props.setSearchInput(e.target.value);
      }}
      placeholder="Find an event"
    ></input>
  );
}

export default Search;
