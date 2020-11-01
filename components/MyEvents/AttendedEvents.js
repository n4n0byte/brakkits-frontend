import withAuth from "@okta/okta-react/dist/withAuth";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBDataTable
} from "mdbreact";
import React from "react";
import EventTable from "./EventTable";
import SpinnyBoi from "../General/SpinnyBoi";

export default withAuth(function AttendedEvents(props) {
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
        <MDBCard className="p-4 ">
          <MDBCardTitle className="justify-content-center">
            Attended Events
          </MDBCardTitle>
          {props.responseData !== null ? (
            <EventTable data={tableData} />
          ) : (
            <SpinnyBoi />
          )}
        </MDBCard>
      </MDBCol>
    </>
  );
});
