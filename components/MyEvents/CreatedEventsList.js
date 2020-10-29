import withAuth from "@okta/okta-react/dist/withAuth";
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
 * Table Component for displaying events
 */
export default withAuth(function CreatedEventsList(props) {
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
      <MDBCol className="col-5 mt-3">
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
            <EventTable data={tableData} />
          ) : (
            <SpinnyBoi />
          )}
          <MDBBtn onClick={() => setShowModal(true)}>Create An Event</MDBBtn>
        </MDBCard>
      </MDBCol>
    </>
  );
});
