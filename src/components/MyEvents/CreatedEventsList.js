import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

import {
  MDBBtn,
  MDBCard,
  MDBCardTitle,
  MDBCol,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter
} from "mdbreact";
import React from "react";
import SpinnyBoi from "../General/SpinnyBoi";
import EventTable from "./EventTable";
import { useState } from "react";
import CreateEventForm from "./CreateEventForm";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Component that lists the events that a user has made
 */
export default withOktaAuth(function CreatedEventsList(props) {
  const [showModal, setShowModal] = useState(false);
  let header = [
    {
      label: "Title",
      field: "title",
      sort: "asc"
    },
    {
      label: "Description",
      field: "description",
      sort: "asc"
    },
    {
      label: "Game",
      field: "gameTitle",
      sort: "asc"
    },
    {
      label: "Capacity",
      field: "capacity",
      sort: "asc"
    }
  ];

  let tableData = {
    columns: header,
    rows: props.responseData === null ? [] : props.responseData.data
  };

  return (
    <>
      
      <MDBCol className="col-5 px-3 mt-3">
        <CreateEventForm
          showModal={showModal}
          setShowModal={setShowModal}
          refresh={props.refresh}
          setRefresh={props.setRefresh}
        />
        <MDBCard className="p-4 ">
          <MDBCardTitle className="justify-content-center">
            Past Events
          </MDBCardTitle>
          {props.responseData !== null ? (
            <EventTable className="px-3" data={tableData} />
          ) : (
            <SpinnyBoi />
          )}
          <MDBBtn onClick={() => setShowModal(true)}>Create An Event</MDBBtn>
        </MDBCard>
      </MDBCol>
    </>
  );
});
