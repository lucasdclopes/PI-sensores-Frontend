import { Component } from "react";
import { Container, Table, Row, Col, InputGroup, FormControl, Form, Card } from 'react-bootstrap';
import './index.css';
import HttpService from '../../services/HttpService';
import HttpServiceHandler from '../../services/HttpServiceHandler';
import RgbHelper from "../../helpers/RgbHelper";
import ErroModal from '../ErroModal';
import Button from 'react-bootstrap/Button';
import MenuLogado from '../MenuLogado';
import Paginacao from '../Paginacao';
import { Modal } from 'react-bootstrap';

import { default as ReactSelect } from "react-select";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js';
import { components } from "react-select";
import DateHelper from "../../helpers/DateHelper";


ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Title);


const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  scales: {
    yTemper: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: 'Temperatura Cº'
      },
    },
    yUmid: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Umidade %'
      },
      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Dados de monitoramento',
    },
  },
};

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const styles = {
  container: base => ({
    ...base,
    flex: 1
  })
};

const default_itens_pagina = 100;

export default class Historico extends Component{

  constructor(props){
    super(props);

    this.state = {
      data: null,
      dadosGrafico: [],
      tipoAgrupamento : 1,
      filtros : {
        paginacaoRequest : {
          size: default_itens_pagina,
          page: 1
        },
        paginacaoResponse : {
          quantidade : null,
          hasProxima : null
        },
        dtInicial : null,
        dtFinal : null,
        tipoAgrupamento : 1
      },
      erroModal : {
        mensagemErro : '',
        show : false,
        titulo : ''
      },
      sucessoModal : {
        mensagem : '',
        show : false,
        redirect : ''
      }   
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

    this.obterLista = () => {
      HttpService.listarMedicoes(this.state.filtros)
      .then((response) => {
        if (!response)
          return;
        if (response.status == 204){
          this.limparDados();
          return;
        }
        let responseData = response.data;
        let datasets = []
        let labels = []
        
        if (labels.length == 0){
          labels = responseData.map((el) => el.dtMedicao);
        }

        let dadosDataset = {
          label: 'temperatura',
          backgroundColor: '#E91E63',
          borderColor: '#E91E63',
          data: responseData.map((el) => el.vlTemperatura),
          yAxisID: 'yTemper'
        };
        datasets.push(dadosDataset);

        dadosDataset = {
          label: 'umidade',
          backgroundColor: '#008FFB',
          borderColor: '#008FFB',
          borderDash: [5, 5],
          data: responseData.map((el) => el.vlUmidade),
          yAxisID: 'yUmid'
          }; 
        datasets.push(dadosDataset);

        this.setState(prevState => ({
          ...prevState,
          data : {
            labels: labels,
            datasets: datasets
          },
          dadosGrafico : responseData,
          filtros : {
            ...prevState.filtros,
            paginacaoResponse : {
              quantidade : parseInt(response.headers['page-quantidade']),
              hasProxima : response.headers['page-has-proxima'] === 'true' ? true : false
            }
          }
        }));
        
      })
      .catch((error) => {
        this.limparFiltros();
        let httpServiceHandler = new HttpServiceHandler();
        httpServiceHandler.validarExceptionHTTP(error,this);
      })
    }


    this.buscarHistorico = (e) => {

      console.log('filtros ',this.state.filtros);
      console.log(this.state.dtInicial);
      let dtInicial = this.state.dtInicial;
      let dtFinal = this.state.dtFinal;

      this.setState(prevState => ({
        ...prevState,
        filtros : {
          ...prevState.filtros,
          paginacaoRequest : {
            ...prevState.filtros.paginacaoRequest,
            page: 1
          },
          dtInicial : dtInicial ? DateHelper.stringToDateStringISO8601_inicioDia(dtInicial):null,
          dtFinal : dtFinal ? DateHelper.stringToDateStringISO8601_fimDia(dtFinal):null,
          tipoAgrupamento : this.state.tipoAgrupamento
          }
        }
      ),() => {this.obterLista();}
      );
    }


    this.checkGerarGrafico = (dadosGrafico) => {
      return (dadosGrafico && Array.isArray(dadosGrafico) && dadosGrafico.length > 0);
    }

    this.handleChangeCheckedSelect = (e) => {
      console.log(e);
      console.log('idPaises',this.state.filtros.idPaises);
      this.setState(prevState => ({
        ...prevState,
        paisesSelecionados : e
      }));
    }

    this.handleChange = (e) => {
      
      console.log(e.target.type);
      console.log(e.target.value);
      console.log('e.target.name ' + e.target.name);

      const name = e.target.name;
      const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
      this.setState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

    this.handleChangeDate = (e) => {
        //console.log('target',e.target.name);
        //console.log('value',e.target.value);
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ 
          [name]: value 
        });
    }

  
    this.limparFiltros = () => {
      console.log('limpando filtros');
      this.setState(prevState => ({
        ...prevState,
        dtInicial: null,
        dtFinal: null,
        tipoAgrupamento: 1,
        filtros : {
          paginacaoRequest : {
            size: default_itens_pagina,
            page: 1
          },
          paginacaoResponse : {
            quantidade : null,
            hasProxima : null
          },
          dtInicial: null,
          dtFinal: null,
          tipoAgrupamento: 1,
          }
        }
      ));
    }

    this.limparDados = () => {
      this.setState(prevState => ({
        ...prevState,
        data: null,
        dadosGrafico:[],

      }  
      )
      );
    }

  }


  

  render(){
    return (
      <div style={{marginTop: "60px"}} >

        <Container className="containerHistorico" fluid>

          <Row>
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 10, offset: 1}} lg={{span: 10, offset: 1}}>
              <MenuLogado/>
            </Col>
          </Row>

          <Row>
            <Col xs={{span: 6, offset: 0}} sm={{span : 6, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <h3>Historico</h3>
            </Col>
          </Row>

          <Col style={{marginTop : "60px"}} xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>

          <div>
          <Card className="mb-3" border="primary" style={{marginTop : "20px"}} >
            <Card.Header>Opções e Filtros</Card.Header>
            <Row className="mb-3">

              <Col xs={3}>
              <Form.Group className="ps-2" controlId="graficoForm.minData">
                <Form.Label>A partir da data</Form.Label>
                <InputGroup >
                  <FormControl 
                    aria-label="Ano mínimo"
                    aria-describedby="Buscar"
                    name = "dtInicial"
                    value = {this.state.dtInicial}
                    onChange={this.handleChangeDate} 
                    type="date"
                  />
                </InputGroup>
              </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Label>Até a data</Form.Label>
                <InputGroup >
                  <FormControl 
                    aria-label="Ano máximo"
                    aria-describedby="Buscar"
                    name = "dtFinal"
                    value = {this.state.dtFinal}
                    onChange={this.handleChangeDate} 
                    type="date"
                  />
                </InputGroup>
              </Col>
              <Col xs={4}>
                <Form.Label>Agrupar por</Form.Label>
                <InputGroup >
                <Form.Select aria-label="Floating label" onChange={this.handleChange} value={this.state.tipoAgrupamento} name="tipoAgrupamento" >
                  <option value="0">Sem agrupar</option>
                  <option value="1">Minuto</option>
                  <option value="2">Hora</option>
                  <option value="3">Dia</option>
                  <option value="4">Semana</option>
                </Form.Select>
                </InputGroup>
              </Col>
            </Row>  
          </Card>
          </div>   

          <Row>
          <Col style={{marginTop : "20px"}}>
            <InputGroup >

              <Button id="btnBuscar"
              onClick={this.buscarHistorico}
              >
                Buscar
              </Button>
            </InputGroup>
          </Col>
          </Row>

          {
            (!this.checkGerarGrafico(this.state.dadosGrafico)) &&
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
            <h5>Não há dados disponíveis para exibir o gráfico </h5>
            </Col>
          }
          </Col>

          {
            (this.checkGerarGrafico(this.state.dadosGrafico)) &&
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
            <Line 
              data={this.state.data} options={options} />
              </Col>
          }

{
          (
            this.checkGerarGrafico(this.state.dadosGrafico)) &&
            <Paginacao style={{marginTop : "60px"}} there={this} />
          }
          
          <Row>
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <h4>Histórico de medições coletadas </h4>
              <Table responsive="sm" striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>dtMedicao</th>
                    <th>vlTemperatura</th>
                    <th>vlUmidade</th>
                  </tr>
                </thead>

                <tbody>
                {
                    this.state.dadosGrafico.map((dado) => {
                    return (
                        
                      <tr key={dado.idMedicao}>
                        <td>{dado.idMedicao}</td>
                        <td>{dado.dtMedicao}</td>
                        <td>{dado.vlTemperatura}</td>
                        <td>{dado.vlUmidade}</td>
                        </tr>
                    )
                    })
                }
                </tbody>
              </Table>
            </Col>
          </Row>

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
            {
              (this.checkGerarGrafico(this.state.dadosGrafico)) &&
              <Paginacao there={this} />
            }
          </Container>
      </div>
    )
  }

  componentDidMount() {
      
    //this.obterPaises();
    this.obterLista();
    
  }


}