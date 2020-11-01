import React from 'react';
import '../../App.css';
import {MDBCard, MDBCol, MDBBtn, MDBCardImage, MDBCardText, MDBCardTitle, MDBCardBody, MDBNavLink} from "mdbreact";


function EventCard(props) {
    return (
        <MDBCol>
            <MDBCard className={'py-2 px-1' }>
                <MDBCardImage className="img-fluid" src={props.imgLink || 'https://mdbootstrap.com/img/Photos/Others/images/43.jpg'} zoom waves cascade />
                <MDBCardBody>
                    <MDBCardTitle>{props.eventName || 'Default Event Name'}</MDBCardTitle>
                    <MDBCardText>
                        {props.description || 'Insert Description'}
                    </MDBCardText>
                    <MDBCardText>
                        Event Date: {props.eventDate || 'TBD'}
                    </MDBCardText>

                    <MDBBtn className={'btn btn-block'} href={`/ShowEvent/${props.eventName}`}>Check</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>

    );
}

export default EventCard;
