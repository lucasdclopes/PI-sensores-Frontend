import { Component } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
export default class ErroModal extends Component {
  
  constructor(props){
    super(props);

    this.handleClose = () => { 
      this.props.closeErroModal();
    };

    this.handleShow = () => { };
    
  } 

  render() {
    return (
      <Modal show={this.props.erroModal.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.erroModal.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.erroModal.mensagemErro}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}