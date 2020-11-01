import React, { useState, useEffect, useCallback } from "react";
import "../../App.css";

import {
  MDBNav,
  MDBNavItem,
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


import { useLocation, useHistory } from "react-router-dom";
import withOktaAuth from "@okta/okta-react/dist/withOktaAuth";

/**
 * Ali Cooper
 * brakkits
 * CST-452
 * 10/18/2020
 * 
 * Navbar for application navigation
 */
export default withOktaAuth(function Nav(props) {
  const location = useLocation();

  const [authenticated, setAuthenticated] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState();
  const [accessToken, setAccessToken] = useState(null);
  const [tag, setTag] = useState();
  const history = useHistory();

  useEffect(() => {
    getUsername();
  }, [accessToken]);

    // pull username from resource server
    async function getUsername() {
      if (authenticated) {
        try{
        console.log(accessToken);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/getUsername`,
          {
            method: "GET",
            headers: new Headers({
              Authorization: `Bearer ${accessToken}`,
            }),
          }
        );
  
        const json = await response.json();
        console.log(json);
        if (json.statusCode != 200) throw json.message;
        setTag(json.data);
  
      } catch (err){
        // history.push({
        //   pathname: '/error',
        //   state: { error: err }
        // })
      }
      }
    }
  

  function navBarBuilder() {  

    return props.links.map((link, index) => (
      <MDBNavItem key={index.toString()}>
        <MDBNavLink className="black-text" to={link[1]}>
          {link[0]}
        </MDBNavLink>
      </MDBNavItem>
    ));
  }

    // get tokens
    useEffect(() => {
      async function getTokens() {
        if (authenticated) {
          const tempUser = await props.authState.user;
          const tempAccessToken = await props.authState.accessToken;
          console.log(tempAccessToken);
          setAccessToken(tempAccessToken);
        } 
      }
      getTokens();
    }, [authenticated]);
  

    /**
   * basic form validation
   */
  function isValidFormData(formData) {
    if (username.length < 3 || username.length > 30) {
      alert("username must be between 2 and 200");
      return false;
    }
    return true;
  }

  

  // will validate and post form data to backend
  async function formUploader(formData) {
    if (accessToken) {
      fetch("${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}/updateUsername", {
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

  function validateAndSendData() {
    var formData = new FormData();
    // append data to form data
    formData.append("username", username);

    if (isValidFormData(formData) == true) {
      formUploader(formData);
    }
  }


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

  return (
    <>
    <MDBNav
      color="peach-gradient"
      className="nav justify-content-left py-2 px-2 mb-1"
    >
      <MDBNavItem>
        <MDBNavLink className="black-text" disabled={false} to={"/"}>
          Brakkits{tag !== undefined && " | " + tag }
        </MDBNavLink>
      </MDBNavItem>
      {/* only render links if they are present */}
      {props.links && navBarBuilder()}

      {authenticated && location.pathname == "/" && (
          <MDBNavItem>
            <MDBNavLink className="black-text" onClick={() => {setShowModal(true)}}  disabled={false} to={"#"}>
                Update Profile
            </MDBNavLink>
          </MDBNavItem>      
      )}

      {authenticated && (
        <MDBNavItem>
          <MDBNavLink
            className="black-text"
            onClick={() => {
              props.authService.logout();
            }}
            to={location.pathname === "/" ? "#" : "/"}
          >
            Log Out
          </MDBNavLink>
        </MDBNavItem>
      )}
    </MDBNav>

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
              <h4 className="offset-3">Update Your Username</h4>
            </MDBCardHeader>
            <MDBCardBody>
              <div className="row">
                <div className="col-9 offset-2">
                  <MDBInput
                    hint="New Username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    required
                    value={username}
                  ></MDBInput>
                </div>
              </div>

              <div className="row pt-4">
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
                    Update
                  </button>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </div>
      </MDBModalBody>
    </MDBModal>

  </>
  );
});
