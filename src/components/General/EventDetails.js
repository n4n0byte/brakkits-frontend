import { useParams } from "react-router";
import Nav from "../General/Nav";
import LoadingSpin from "react-loading-spin";
import React, { useState, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import {
  MDBCard,
  MDBCol,
  MDBBtn,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCardBody,
  MDBNavLink,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBDropdown,
  MDBInput,
  MDBCardHeader,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownMenu,
} from "mdbreact";

import {
  useHistory,
} from "react-router-dom";


import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";
import DynamicEventBtn from "./DynamicEventBtn";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Displays event details and allows a user to join/leave events
 */
export default withOktaAuth(function EventDetails(props) {
  const { eventName } = useParams();
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [selectedStartDate, selectedStartDateChange] = useState(new Date());
  const [gameTitle, setGameTitle] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [image, setImage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [oldTitle, setOldTitle] = useState(true);
  const history = useHistory();

  // set Authentication
  useEffect(() => {
    async function checkAuthentication() {
      const isAuthenticated = await props.authState.isAuthenticated;

      if (isAuthenticated !== authenticated) {
        setAuthenticated(isAuthenticated);
      }
    }

    checkAuthentication();
  }, [authenticated]);

  function validateAndSendData() {
    var formData = new FormData();
    // append data to form data
    formData.append("image", image);
    formData.append("gameTitle", gameTitle);
    formData.append("selectedStartDate", new Date());
    formData.append("description", description);
    formData.append("title", title);
    formData.append("oldTitle", oldTitle)

    if (isValidFormData(formData) == true) {
      formUploader(formData);
    }
  }


  /**
   * basic form validation
   */
  function isValidFormData(formData) {
    if (title.length < 1 || title.length > 30) {
      alert("event title must be between 1 and 30");
      return false;
    }
    if (description.length < 2 || description.length > 200) {
      alert("description must be between 2 and 200");
      return false;
    }
    if (image == null) {
      alert("please add an image");
      return false;
    }
    if (gameTitle.length < 2 || gameTitle.length > 30) {
      alert("game title must be between 1 and 30");
      return false;
    }
    if (
      gameTitle.length == 0 ||
      gameTitle == undefined ||
      gameTitle === "" ||
      gameTitle === "<empty string>"
    ) {
      alert("please select a game");
      return false;
    }
    return true;
  }

  // will validate and post form data to backend
  function formUploader(formData) {
    if (accessToken) {
      fetch("http://localhost:8080/updateEvent", {
        method: "POST",
        body: formData,
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      });
      setShowModal(false);
      history.push("/");

    }
  }

  // get tokens
  useEffect(() => {
    async function getTokens() {
      if (authenticated) {
        const tempUser = await props.authState.user;
        const tempIdToken = await props.authState.idToken;
        const tempAccessToken = await props.authState.accessToken;
        console.log(tempAccessToken);
        setIdToken(tempIdToken);
        setAccessToken(tempAccessToken);
      } else {
        setUser(null);
      }
    }
    getTokens();
  }, [authenticated]);

  // updates event then moves to home screen
  useEffect(() => {
    async function sendUpdate() {
      const response = await fetch(
        `http://localhost:8080/findEventByName?eventName=${eventName}`,
        {
          headers: new Headers({
            method: "GET",
            Authorization: `Bearer ${accessToken}`,
          }),
        }
      ).catch((e) => console.log(e));
      const json = await response.json().catch((e) => console.log(e));
      setOldTitle(json.data.title);
      console.log(json.data)
      setTournament(json.data);
    }
    if (accessToken) {
      sendUpdate();
    }
  }, [accessToken]);

  /**
   * builds the stageList
   * for the main event view
   */
  function buildStageList() {
    return tournament.stageList.map((stage, index) => (
      <li
        className="list-group-item col-12 mx-auto p-2 mt-1 text-left overflow-auto"
        style={{ maxHeiht: "30vh" }}
        key={index}
      >
        {stage}
      </li>
    ));
  }

  /**
   * builds the Attendees List
   * for the main event view
   */
  function makeAttendees() {
    return tournament.attendees.map((attendee, index) => (
      <li
        className="list-group-item col-12 mx-auto p-2 mt-1 text-left overflow-auto"
        key={index}
      >
        {attendee.tag}
      </li>
    ));
  }

  return (
    <>
      <Nav links={[["Home", "/"]]} />

      <MDBModal
      size="lg"
      show={showModal}
      onHide={() => setShowModal(false)}
      isOpen={showModal}>
      <MDBModalHeader toggle={() => setShowModal(false)}></MDBModalHeader>

      <MDBModalBody>
        <div className="container w-75">
          <MDBCard>
            <MDBCardHeader>
              <h4 className="offset-4">Create an Event</h4>
            </MDBCardHeader>
            <MDBCardBody>
              <div className="row">
                <div className="col-9 offset-2">
                  <MDBInput
                    hint="Event Title"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    required
                    value={title}
                  ></MDBInput>
                </div>
              </div>

              <div className="row">
                <div className="col-9 offset-2">
                  <MDBInput
                    hint="Event Description"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    value={description}
                    required
                  ></MDBInput>
                </div>

              </div>
              <div className="row">
                <div className="col-12 offset-2">
                  <FormControl className="col-12 mx-auto w-75" required={true}>
                    <InputLabel id="demo-simple-select-label" />
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={(e) => {
                        setGameTitle(e.target.value);
                      }}
                    >
                      <MenuItem value={"Smash Ultimate"}>
                        Super Smash Brothers. Ultimate
                      </MenuItem>
                      <MenuItem value={"Smash 4"}>
                        Super Smash Brothers. for Wii U/3DS
                      </MenuItem>
                      <MenuItem value={"Melee"}>
                        Super Smash Brothers. Melee
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row pt-4">
                <div className="offset-3">
                  <div className="form-group">
                    <label for="avatar">Choose a Tournament picture:</label>

                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                      }}
                    />
                  </div>
                </div>
                <div className="offset-2 col-5">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      return false;
                    }}
                    className="btn btn-danger btn-sm"
                    type="submit"
                  >
                    Cancel
                  </button>
                </div>
                <div className="col-1">
                  <button
                    onClick={validateAndSendData}
                    className="btn btn-primary btn-sm"
                  >
                    Create
                  </button>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </div>
      </MDBModalBody>
    </MDBModal>

      <div className="container pt-5">
        <div className="card p-4">
          <div className="row">
            <div className="col-lg-5"></div>
            <h2 className=" mx-3 px-1 py-3 "><a onClick={()=>{setShowModal(true);}} href="#">{eventName}</a> </h2>
          </div>
          <div className="row">
            <div className="col-3">
              <div className="card">
                <div className="card-header">
                  <h3>Stage List</h3>
                </div>
                <div className="card-body">
                  <div
                    className="list-group"
                    style={{ maxHeight: "34.5vh", minHeight: "34.5vh" }}
                  >
                    {tournament ? buildStageList() : <LoadingSpin />}
                  </div>
                </div>
                <div className="card-footer">
                  Points: {tournament ? tournament.points : <LoadingSpin />}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card">
                <div className="card-header">
                  <h4>Attendees</h4>
                </div>
                <div className="card-body">
                  <div
                    className="list-group overflow-auto"
                    style={{ maxHeight: "40vh", minHeight: "40vh" }}
                  >
                    {tournament ? makeAttendees() : <LoadingSpin />}
                  </div>
                </div>
                <div className="card-footer">
                  <DynamicEventBtn eventName={eventName} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
