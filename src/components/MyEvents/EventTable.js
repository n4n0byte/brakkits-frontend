import { MDBDataTable } from "mdbreact";
import { ReactTournament } from "react-tournament";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import LoadingSpin from "react-loading-spin";
import Event from "../General/Event";
import Nav from "../General/Nav";
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Shows available events
 */

export default withOktaAuth(function EventTable(props) {
  return (
    <>
      <MDBDataTable
        striped
        maxHeight="47vh"
        scrollY
        paging={false}
        small
        searching={false}
        className=""
        data={props.data}
      />
    </>
  );
});
