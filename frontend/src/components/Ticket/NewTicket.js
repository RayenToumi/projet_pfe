import React from "react";
import TicketTable from "components/Cards/TicketTable";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function NewTicket() {
  return (
    <center>
  <Container>
    <Row>
      
      <Col>
      <Link to="/Ticket">
        <Button className="mt-5 mb-2 bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-2 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-5 ease-linear transition-all duration-150 "
        >Add new ticket</Button></Link>
      </Col>
      <Col>
      Total tickets:50
      </Col>
      <Col>
      Pending tickets: 5
      </Col>
      
    </Row>
 
      
      <br/>
  
    <Row>
    <div className="container-fluid">
      <TicketTable/>
    </div>
    </Row>
  </Container>
  </center>
  );
}
