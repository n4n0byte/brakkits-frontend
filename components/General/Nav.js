import React, { useState, useEffect } from 'react';
import '../../App.css';
import {MDBContainer, MDBListGroup, MDBNav, MDBNavbarBrand, MDBNavItem, MDBNavLink} from "mdbreact";
import {useLocation} from 'react-router-dom';
import withAuth from '@okta/okta-react/dist/withAuth';

/**
 * Navbar
 * TODO: add to each compnent and use variables for links
 * @returns {*}
 * @constructor
 */
export default withAuth(function Nav(props) {

    const location = useLocation();

    const [authenticated, setAuthenticated] = useState(null);

    function navBarBuilder(){

        return(
            props.links.map(
                (link,index) => (
                <MDBNavItem key={index.toString()} >
                    <MDBNavLink className="black-text" to={link[1]} >{link[0]}</MDBNavLink>
                </MDBNavItem>
                        
                )               
            )
        )
    }
    

   
    // set Authentication
    useEffect(
        () => {
            async function checkAuthentication() {
                const isAuthenticated = await props.auth.isAuthenticated();
                if (isAuthenticated !== authenticated) {
                    setAuthenticated(isAuthenticated);
                }
                }

            checkAuthentication();

        }
        ,[authenticated]
    )

    return (
        <MDBNav color="peach-gradient" className="nav justify-content-left py-2 px-2 mb-1">
            <MDBNavItem>
                <MDBNavLink className="black-text"  disabled={false} to={"/"}>Brakkits</MDBNavLink>
            </MDBNavItem>
            {/* only render links if they are present */}
            {props.links && navBarBuilder()}

            {
                authenticated
                &&
                <MDBNavItem>
                    <MDBNavLink className="black-text" onClick={() => {
                        props.auth.logout()                        
                    }}  to={location.pathname === "/" ? "#" : "/" }>Log Out</MDBNavLink>
                </MDBNavItem>
            }

        </MDBNav>

    );
});

