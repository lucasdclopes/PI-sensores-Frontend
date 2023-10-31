import { Component } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";

export default class ConfirmacaoModal extends Component {

  constructor(props){
    super(props);

    console.log("propsaaaa -> ",props);

    this.handleClose = () => { 
      this.props.closeConfirmacaoModal();
    };

    this.handleShow = () => { };

    this.callBack = () => {
      this.props.handleSimConfirmacaoModal();
    }
    
  } 

  render() {
    return (
      <Modal show={this.props.confirmacaoModal.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.confirmacaoModal.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.confirmacaoModal.perguntaConfirmacao}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.callBack}>
            Sim
          </Button>

          <Button variant="secondary" onClick={this.handleClose}>
            Não
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }




}