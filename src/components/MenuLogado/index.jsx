import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";
import './index.css';
import UsuarioLogadoDto from '../../dto/UsuarioLogadoDto';

export default class MenuLogado extends Component {

  constructor(props){
    super(props);

    this.logoff = () => {
      UsuarioLogadoDto.logoff();
      window.location="/login";
    }

  }

  render() {
    return (
      <Navbar fixed="top" bg="light" expand={false}>
        <Container fluid>
          <Navbar.Brand href="#" id="tituloSistema">
            Monitoramento por sensores
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Lista de funcionalidades</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link className="linkMenu" to={"/tempo-real"}>Tempo Real</Link>
                <Link className="linkMenu" to={"/alertas"}>Alertas</Link>
                <Link className="linkMenu" to={"/historico"}>Historico</Link>
                <a className="linkMenu" style={{"cursor" : "pointer"}} onClick={this.logoff}>Sair</a>                
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  }
}