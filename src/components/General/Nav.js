import React, { useState, useEffect } from "react";
import "../../App.css";
import {
  MDBContainer,
  MDBListGroup,
  MDBNav,
  MDBNavbarBrand,
  MDBNavItem,
  MDBNavLink
} from "mdbreact";
import { useLocation } from "react-router-dom";
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

  function navBarBuilder() {
    return props.links.map((link, index) => (
      <MDBNavItem key={index.toString()}>
        <MDBNavLink className="black-text" to={link[1]}>
          {link[0]}
        </MDBNavLink>
      </MDBNavItem>
    ));
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
    <MDBNav
      color="peach-gradient"
      className="nav justify-content-left py-2 px-2 mb-1"
    >
      <MDBNavItem>
        <MDBNavLink className="black-text" disabled={false} to={"/"}>
          Brakkits
        </MDBNavLink>
      </MDBNavItem>
      {/* only render links if they are present */}
      {props.links && navBarBuilder()}

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
  );
});
