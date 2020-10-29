import {MDBDataTable} from "mdbreact";
import {ReactTournament} from "react-tournament";
import React, {useState, useEffect} from "react";
import {useParams} from "react-router";
import LoadingSpin from 'react-loading-spin';
import Event from '../General/Event';
import Nav from '../General/Nav';
import withAuth from "@okta/okta-react/dist/withAuth";

export default withAuth(function EventTable(props) {


    return (
        <>        
            <MDBDataTable striped  maxHeight="47vh"  scrollY paging={false} small searching={false}  className="px-2" data={props.data}/>
        </>
      );
  


})