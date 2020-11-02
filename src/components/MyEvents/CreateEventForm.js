import DateFnsUtils from "@date-io/date-fns";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "date-fns";
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Event Form Component
 */

import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBDropdown,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownMenu,
  
} from "mdbreact";
import React, { useState, useEffect } from "react";

/**
 * Create Events Form
 * @param {*} props
 */
export default withOktaAuth(function CreateEventForm(props) {
  /**
   * setup state hooks
   */
  const [selectedStartDate, selectedStartDateChange] = useState(new Date());
  const [gameTitle, setGameTitle] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [image, setImage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);

  // set Authentication
  useEffect(() => {
    async function checkAuthentication() {
      const isAuthenticated = await props.authState.isAuthenticated;

      if (isAuthenticated !== authenticated) {
        const tempAccessToken = await props.authState.accessToken;
        setAuthenticated(isAuthenticated);
        setAccessToken(tempAccessToken);
      }
    }

    checkAuthentication();
  }, [authenticated]);

  // will validate and post form data to backend
  function formUploader(formData) {
    if (accessToken) {
      fetch(`${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/createEvent`, {
        method: "post",
        body: formData,
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      }) .then(response => response.json())
      .then(data => console.log(data));
      props.setRefresh("update");
      props.setShowModal(false);
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
    if (capacity < 8 || capacity > 256) {
      alert("capacity must be between 8 and 256");
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
    
    if (capacity < 2 || capacity > 256) {
      alert("capacity must be between 8 and 256");
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

  function validateAndSendData() {
    var formData = new FormData();
    // append data to form data
    formData.append("image", image);
    formData.append("gameTitle", gameTitle);
    formData.append("selectedStartDate", new Date());
    formData.append("description", description);
    formData.append("title", title);
    formData.append("capacity", capacity);

    if (isValidFormData(formData) == true) {
      formUploader(formData);
    }
  }

  /**
   * form submission
   */
  useEffect(() => {}, []);

  return (
    <MDBModal
      size="lg"
      show={props.showModal}
      onHide={() => props.setShowModal(false)}
      isOpen={props.showModal}
    >
      <MDBModalHeader toggle={() => props.setShowModal(false)}></MDBModalHeader>

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
                <div className="offset-2 col-9 ">
                  <MDBInput
                    type="number"
                    hint="Capacity"
                    required={true}
                    min={8}
                    max={256}
                    onChange={(e) => {
                      setCapacity(e.target.value);
                    }}
                    value={capacity}
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
                      props.setShowModal(false);
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
  );
});
