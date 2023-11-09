import { Component } from "react";
import { Container, Table, Form, Row, Col, InputGroup, FormControl, ButtonGroup, ToggleButton, Card } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './index.css';
import queryString from 'query-string';
import HttpService from '../../services/HttpService';
import HttpServiceHandler from '../../services/HttpServiceHandler';
import ErroModal from '../ErroModal';
import Button from 'react-bootstrap/Button';
import MenuLogado from '../MenuLogado';
import { Modal } from 'react-bootstrap';
import ConfirmacaoModal from "../ConfirmacaoModal";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Paginacao from '../Paginacao';
import AsyncSelect from 'react-select/async';
import Switch from "react-switch";

const TipoAlerta = {
  0:"Selecione",
  1:"Temperatura",
  2:"Umidade"
} 

function getAlertaById (alertas, idAlerta) {
  return alertas.filter(el => el.idAlerta == idAlerta)[0];
}

function getIndexAlertaById (alertas, idAlerta) {
  for (let i = 0; i < alertas.length; i++) {
    
    if (alertas[i].idAlerta == idAlerta)
      return i;  
  }

}

const dadosLimpos = {      
  idAlerta : 0,
  dtCriado : "",
  destinatarios : "",
  intervaloEsperaSegundos : "",
  isHabilitado : false, 
  tipoAlerta : 0,  
  vlMax: '',
  vlMin: ''
}

export default class Alertas extends Component{

  constructor(props){
    super(props);

    this.state = {
      ...dadosLimpos,
      alertas : [],   
      filtros : {
        paginacaoRequest : {
          size: 15,
          page: 1
        },
        paginacaoResponse : {
          quantidade : null,
          hasProxima : null
        }
      },
      isEdicao: false,
      isNovo: false,
      erroModal : {
        mensagemErro : '',
        show : false,
        titulo : ''
      },
      sucessoModal : {
        mensagem : '',
        show : false,
        redirect : ''
      }, 
      confirmacaoModal : {
        perguntaConfirmacao : '',
        show : false,
        titulo : '',
        callBackSim : null
      },      
    };

    this.closeErroModal = () => {
      this.setState({
        erroModal : {
          mensagemErro : '',
          showModalErro : false,
          titulo : ''
        }
      });
    }

    this.selecionarPagina = (numeroPagina) => {
      this.setState(prevState => ({
        ...prevState,
        filtros : {
          ...prevState.filtros,
          paginacaoRequest : {
            ...prevState.filtros.paginacaoRequest,
            page : numeroPagina
          }
        }
      }), () => {
        this.obterLista();
      });
    }

    this.incrementarPagina = (incremento) => {
      let incrementoPagina = this.state.filtros.paginacaoRequest.page + incremento;

      if (incrementoPagina > 0)
        this.selecionarPagina(incrementoPagina);
    }

    this.closeSucessoModal = () => {
      if (this.state.sucessoModal.redirect) {
        window.location = this.state.sucessoModal.redirect;
      }

      this.setState({
        sucessoModal : {
          mensagem : '',
          show : false
        }
      });
    }

    this.obterLista = () => {
      HttpService.listarAlertas(this.state.filtros)
      .then((response) => {
        if (response){
          this.setState(prevState => ({
            ...prevState,
            alertas : response.status == 204 ? this.state.alertas : response.data,
            filtros : {
              ...prevState.filtros,
              paginacaoResponse : {
                quantidade : parseInt(response.headers['page-quantidade']),
                hasProxima : response.headers['page-has-proxima'] === 'true' ? true : false
              }
            }
          }));
        }
      })
      .catch((error) => {
        let httpServiceHandler = new HttpServiceHandler();
        httpServiceHandler.validarExceptionHTTP(error,this);
      })
    }

    this.toggleStatusAlerta = (e, alertas, idAlerta) => {
      console.log('toggleStatusAlerta');
      alertas = [...alertas];
      alertas[getIndexAlertaById(alertas,idAlerta)].isHabilitado = e;

      HttpService.salvarAlerta({
        isHabilitado : e,
      },
      idAlerta
      )
      .then((response) => {
        this.setState(prevState => ({
          ...prevState,
          alertas : alertas
        }), () => {
          this.obterLista();
        });

      })
      .catch((error) => {
        new HttpServiceHandler().validarExceptionHTTP(error, this);
      }); 


    }

    this.abrirConfirmacaoModal = () => {
      this.setState({
        confirmacaoModal : {
          perguntaConfirmacao : 'Deseja realmente excluir o alerta? O histórico de envios deste alerta também será removido. Isto NÃO poderá ser desfeito.',
          show : true,
          titulo : 'Remover alerta',
        }
      });
    }

    this.handleSimConfirmacaoModal = () => {
      HttpService.deletarAlerta(this.state.idAlerta)
      .then((response) => {
        if (response) {
          this.setState({
            sucessoModal : {
              mensagem : 'Alerta excluído com sucesso.',
              show : true
            }
          });

        this.setState(prevState => ({
          ...prevState,
          ...dadosLimpos,
          isEdicao : false,
          isNovo : false,
        }), () => {
          this.obterLista();
        });

        }
      })
      .catch((error) => {
        new HttpServiceHandler().validarExceptionHTTP(error, this);
      })
      .finally(() => {
        this.closeConfirmacaoModal();
      });

    }

    this.closeConfirmacaoModal = () => {
      this.setState({
        confirmacaoModal : {
          perguntaConfirmacao : '',
          show : false,
          titulo : '',
          callBackSim : null
        }
      });
    }

    this.abrirSucessoModal = (msg,redirect) => {
      this.setState({
        sucessoModal : {
          mensagem : msg,
          show : true,
          redirect : redirect
        }
      });
    }

    this.novoAlerta = () => {

      this.setState(prevState => ({
        ...prevState,
        ...dadosLimpos,
        intervaloEsperaSegundos: 5,
        isNovo: true,
        tipoAlerta: 1,
        isEdicao: false
      }), () => {
        this.obterLista();
      });
    }

    this.cancelar = () => {

      this.setState(prevState => ({
        ...prevState,
        ...dadosLimpos,
        isNovo: false,
        isEdicao: false
      }), () => {
        this.obterLista();
      });
    }

    this.exibirDadosAlerta = (idAlerta) => {
      console.log('buscando bene');
      this.limparDados();
      HttpService.listarAlertasEnviados(idAlerta)
      .then((response) => {

        let data = response.data;
        let alerta = getAlertaById(this.state.alertas,idAlerta);
        console.log(alerta);
        this.setState(prevState => ({
          ...prevState, 
          idAlerta : alerta.idAlerta,
          dtCriado : alerta.dtCriado,
          destinatarios : alerta.destinatarios,
          intervaloEsperaSegundos : alerta.intervaloEsperaSegundos / 60,
          isHabilitado : alerta.isHabilitado, 
          tipoAlerta : alerta.tipoAlerta,  
          vlMax : alerta.vlMax,
          vlMin : alerta.vlMin,
          isEdicao: true,
          isNovo: false
        }));
      })
      .catch((error) => {
        new HttpServiceHandler().validarExceptionHTTP(error, this);
      }); 
    }


    this.salvarAlerta = (e) => {

      let jsonRequest = {};
      if (this.state.idAlerta == 0) {
        jsonRequest = {
          tipoAlerta: this.state.tipoAlerta,
          intervaloEsperaSegundos: this.state.intervaloEsperaSegundos * 60,
          vlMax: this.state.vlMax == "" ? null : this.state.vlMax,
          vlMin: this.state.vlMin == "" ? null : this.state.vlMin,
          destinatarios: this.state.destinatarios
        }
      } else {
        jsonRequest = {
          intervaloEsperaSegundos: this.state.intervaloEsperaSegundos * 60,
          tipoAlerta: this.state.tipoAlerta,
          destinatarios: this.state.destinatarios
        }
      }

      HttpService.salvarAlerta(jsonRequest,this.state.idAlerta)
      .then((response) => {
        if (response) {
          this.setState({
            sucessoModal : {
              mensagem : (this.state.idAlerta == 0)?'Alerta criado com sucesso.':'Alerta atualizado',
              show : true
            }
          });
        }

      this.setState(prevState => ({
        ...prevState,
        ...dadosLimpos,
        isEdicao: false,
        isNovo: false
      }), () => {
        this.obterLista();
      });

      })
      .catch((error) => {
        new HttpServiceHandler().validarExceptionHTTP(error, this);
      }); 
    }

    
    this.deletarAlerta = (e) => {
      this.abrirConfirmacaoModal();
    }

    this.handleChange = (e) => {
      
      console.log(e.target.type);
      console.log(e.target.value);
      console.log('e.target.name ' + e.target.name);

      const name = e.target.name;
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      this.setState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

    this.handleChangeNumerico = (e) => {
    
      //console.log('num ' + this.state.paramBusca);
      //console.log('num ' + e.target.type);
      //console.log('num ' + e.target.value);
      //console.log('num e.target.name ' + e.target.name);
      
      let valueLen = ""+e.target.value.length;
      const re = /^-?\d+(\.\d{1,2})?$/;
      if (e.target.value === '' || (""+e.target.value).substring(valueLen-1,valueLen-0) == '.' || re.test(e.target.value)) {
        console.log('noif');
        const name = e.target.name;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        this.setState({ 
          [name]: value 
        });
     } 
    }

    this.handleChangeInteiro = (e) => {
    
      //console.log('num ' + this.state.paramBusca);
      //console.log('num ' + e.target.type);
      //console.log('num ' + e.target.value);
      //console.log('num e.target.name ' + e.target.name);

      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        console.log('noif');
        const name = e.target.name;
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        this.setState({ 
          [name]: value 
        });
     } 
    }
  
    this.limparDados = (e) => {
      console.log('limpando dados');
      this.setState(prevState => ({
        ...prevState,
        ...dadosLimpos
      }
      ));
    }    
  }


  

  render(){

    return (
      <div>

        <Container className="containerAlertas" fluid>

          <Row>
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 10, offset: 1}} lg={{span: 10, offset: 1}}>
              <MenuLogado/>
            </Col>
          </Row>

          <Row>
            <Col xs={{span: 6, offset: 0}} sm={{span : 6, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <h3 className="alertas">Alertas</h3>
            </Col>
          </Row>
        
          <Row className="mb-3">
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <Form>
                <Row>
                  <Col xs={3}>
                    <OverlayTrigger
                      key="bottom"
                      placement="bottom"
                      overlay={
                      <Tooltip id="tooltip-disabled">
                      <strong> {(this.state.isEdicao)?
                        'Este valor não pode ser alterado após a criação do alerta. É necessário criar um novo alerta com novos valores'
                        : 'Define um valor máximo que, caso ultrapassado, disparará o alerta de monitoramento'
                      }
                        </strong>
                      </Tooltip>}
                    >  
                      <Form.Group className="inputAlerta" controlId="alertaForm.vlLimite">
                          <Form.Label>Limite máximo</Form.Label>
                          <Form.Control type="text" placeholder={"45"} disabled={!this.state.isNovo} value={this.state.vlMax} 
                          onChange={this.handleChangeNumerico} name="vlMax" required autoComplete="false" maxLength="6"
                          />
                      </Form.Group>
                    </OverlayTrigger>
                  </Col>
                  <Col xs={3}>
                    <OverlayTrigger
                      key="bottom"
                      placement="bottom"
                      overlay={
                      <Tooltip id="tooltip-disabled">
                      <strong> {(this.state.isEdicao)?
                        'Este valor não pode ser alterado após a criação do alerta. É necessário criar um novo alerta com novos valores'
                        : 'Define um valor mínimo que, caso o valor mensurado seja menor, disparará o alerta de monitoramento'
                      }
                        </strong>
                      </Tooltip>}
                    >  
                      <Form.Group className="inputAlerta" controlId="alertaForm.vlLimite">
                          <Form.Label>Limite Mínimo</Form.Label>
                          <Form.Control type="text" placeholder={"5"} disabled={!this.state.isNovo} value={this.state.vlMin} 
                          onChange={this.handleChangeNumerico} name="vlMin" required autoComplete="false" maxLength="6"
                          />
                      </Form.Group>
                    </OverlayTrigger>
                  </Col>

                  <Col xs={6}>
                    {(!this.state.isNovo)&&
                      <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={
                        <Tooltip id="tooltip-disabled">
                        <strong> {(this.state.isEdicao)?
                          'Este valor não pode ser alterado após a criação do alerta. É necessário criar um novo alerta com novos valores'
                          : 'Define qual sensor será utilizado para monitorar os valores. Temperatura, ou umidade'
                        }
                          </strong>
                        </Tooltip>}
                      >  
                      <Form.Group className="inputAlerta" controlId="alertaForm.tipoAlerta">
                          <Form.Label>Tipo de sensor</Form.Label>
                          <Form.Control type="text" placeholder={"Temperatura ou umidade"} disabled={!this.state.isNovo} onChange={this.handleChange} 
                          value={TipoAlerta[this.state.tipoAlerta]} name="tipoAlerta" required autoComplete="false" maxLength="30"
                          />
                      </Form.Group>
                    </OverlayTrigger>}
                    
                    {(this.state.isNovo)&&
                    <Form.Group className="inputAlerta" controlId="alertaForm.tipoAlerta">
                      <Form.Label>Tipo de sensor</Form.Label>
                      <Form.Select aria-label="Floating label" onChange={this.handleChange} value={this.state.tipoAlerta} name="tipoAlerta" >
                        <option value="1">Temperatura</option>
                        <option value="2">Umidade</option>
                      </Form.Select>
                      
                    </Form.Group>  
                    }
                  </Col>
                </Row>
                <Row>

                  <Col xs={6}>
                    <OverlayTrigger
                        key="bottom"
                        placement="bottom"
                        overlay={
                        <Tooltip id="tooltip-disabled">
                        <strong>Este campo é somente informativo, não há o que ser alterado</strong>
                        </Tooltip>}
                      >  
                      <Form.Group className="inputAlerta" controlId="alertaForm.dtCriacao">
                          <Form.Label>Data da criação</Form.Label>
                          <Form.Control type="text" placeholder={"DD/MM/AAAA"}  disabled={true} 
                          onChange={this.handleChange} value={(this.state.dtCriado)?this.state.dtCriado:""} name="dtCriacao" required autoComplete="false" maxLength="10"
                          />  
                      </Form.Group>
                    </OverlayTrigger>
                  </Col>
                

                
                  <Col xs={6}>
                    <Form.Group className="inputAlerta" controlId="alertaForm.freqAlerta">
                        <Form.Label>Frequência máxima deste alerta por minuto</Form.Label>
                        <Form.Control type="text" placeholder={"5 minutos"} disabled={!(this.state.isNovo || this.state.isEdicao )} value={this.state.intervaloEsperaSegundos} 
                        onChange={this.handleChangeInteiro} name="intervaloEsperaSegundos" required autoComplete="false" maxLength="3"
                        />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Form.Group as={Col} className="inputAlerta" controlId="alertaForm.emails">
                        <Form.Label>E-mails para recebimento de alertas (separados por vírgula)</Form.Label>
                        <Form.Control as="textarea" rows={3} disabled={!(this.state.isEdicao || this.state.isNovo)}  placeholder={"exemplo@outlook.com,outro_exemplo@gmail.com,mais.um.exemplo@uol.com.br"} onChange={this.handleChange}
                        value={this.state.destinatarios} name="destinatarios" required autoComplete="false" maxLength="500"
                        />
                    </Form.Group>
                  </Col>
                </Row>
                
              </Form>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <Button onClick={this.novoAlerta} disabled={this.state.isEdicao || this.state.isNovo}>Novo</Button>
              <Button variant="success" className="btnSalvarAlerta" onClick={this.salvarAlerta} disabled={!(this.state.isEdicao || this.state.isNovo )}>Salvar</Button>
              <Button variant="secondary" className="btnCancelar" onClick={this.cancelar} disabled={!(this.state.isEdicao || this.state.isNovo )}>Cancelar</Button>
              <Button variant="danger" className="btnDeletarAlerta" onClick={this.deletarAlerta} disabled={this.state.idAlerta == 0}>Deletar</Button>            
            </Col>
          </Row>

          <Row style={{marginTop : "60px"}}>
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <h4>Alertas Cadastrados </h4>
              <Table responsive="sm" striped bordered hover>
                <thead>
                  <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Sensor</th>
                      <th>Limite máximo</th>
                      <th>Limite mínimo</th>
                      <th>Último envio</th>
                      <th>Detalhes</th>
                  </tr>
                </thead>

                <tbody>
                {
                    this.state.alertas.map((alerta) => {
                    return (
                        
                        <tr key={alerta.idAlerta}>
                        <td>{alerta.idAlerta}</td>
                        <td><Switch onChange={e => this.toggleStatusAlerta(e,this.state.alertas,alerta.idAlerta)} checked={this.state.alertas[getIndexAlertaById(this.state.alertas,alerta.idAlerta)].isHabilitado} /></td>
                        <td>{TipoAlerta[alerta.tipoAlerta]}</td>
                        <td>{(alerta.vlMax)? alerta.vlMax : "N/A" }</td>
                        <td>{(alerta.vlMin)? alerta.vlMin : "N/A"}</td>
                        <td>{(alerta.dtUltimoEnvio)? alerta.dtUltimoEnvio : "N/A" }</td>
                        <td style={{textAlign : "center"}}>
                            {/* <Button onClick={() => {this.visualizarAula(aula.idAula)}}>Visualizar Aula</Button> */}
                            <Button onClick={() => {this.exibirDadosAlerta(alerta.idAlerta)}}>Editar/Ver Detalhes</Button>
                        </td>
                        </tr>
                    )
                    })
                }
                </tbody>
              </Table>
            </Col>
          </Row>
         { (this.state.alertas !== 'undefined' && this.state.alertas.length > 0) &&
          <Paginacao there={this} />
         }
            <Modal show={this.state.sucessoModal.show} onHide={this.closeSucessoModal}>
              <Modal.Header closeButton>
                <Modal.Title>Sucesso</Modal.Title>
              </Modal.Header>
              <Modal.Body>{this.state.sucessoModal.mensagem}</Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={this.closeSucessoModal}>
                  Ok
                  </Button>
              </Modal.Footer>
              </Modal>
            
            <ErroModal closeErroModal={this.closeErroModal} erroModal={this.state.erroModal}/>
            <ConfirmacaoModal closeConfirmacaoModal={this.closeConfirmacaoModal} handleSimConfirmacaoModal={this.handleSimConfirmacaoModal} confirmacaoModal={this.state.confirmacaoModal}></ConfirmacaoModal>
          </Container>
      </div>
    )
  }

  componentDidMount() {      
    this.obterLista();
  }


}