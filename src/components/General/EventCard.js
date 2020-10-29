import React from "react";
import "../../App.css";
import {
  MDBCard,
  MDBCol,
  MDBBtn,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCardBody,
  MDBNavLink,
} from "mdbreact";


/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Card showing event info + picture
 */
function EventCard(props) {
  return (
    <MDBCol>
      <MDBCard className={"py-2 px-1"}>
        <img
          className="img-fluid zoom waves cascade"
          style={{ maxHeight: "20vh", minHeight: "20vh" }}
          src={
            props.imgLink ||
            "https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
          }
        ></img>
        <MDBCardBody>
          <MDBCardTitle>{props.eventName || "Default Event Name"}</MDBCardTitle>
          <MDBCardText>{props.description || "Insert Description"}</MDBCardText>
          <MDBCardText>Date Created: {props.eventDate || "TBD"}</MDBCardText>
          <MDBBtn
            className={"btn btn-block"}
            href={
              props.isActive
                ? `/showEvent/${props.eventName}`
                : `/eventDetails/${props.eventName}`
            }
          >
            Check
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
}

export default EventCard;
