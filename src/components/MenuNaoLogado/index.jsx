import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import './index.css';

export default class MenuNaoLogado extends Component {

  constructor(props){
    super(props)
  }

  render(){
    return (
      <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="#home">Secretaria Escolar</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Link className="itemMenu" to={"/"}>Home</Link>
            <Link className="itemMenu" to={"/login"}>Login</Link>

            {/* <Nav.Link href="/" >Home</Nav.Link>
            <Nav.Link href="/login" >Login</Nav.Link> */}
            
            <Nav.Link style={{padding : "0.5rem 1rem"}} href="mailto:lucas.dc.lopes@gmail.com">Contato</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}