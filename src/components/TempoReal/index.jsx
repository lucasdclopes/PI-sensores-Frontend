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


ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Title);


export const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  scales: {
    yPib: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: 'PIB'
      },
    },
    yPibPerCapita: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'PIB Per Capita'
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
      text: 'Dados de PIB',
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

const default_itens_pagina = 30;


export default class TempoReal extends Component{

  constructor(props){
    super(props);

    this.state = {
      data: null,
      dadosGrafico: [],
      filtros : {
        paginacaoRequest : {
          size: 20,
          page: 1
        },
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

    this.obterLista = () => {
      console.log('obterLista');
      HttpService.listarMedicoes(this.state.filtros)
      .then((response) => {
        if (response){

          let datasets = []
          let labels = []
          let responseApi = response.data;
          let cor = RgbHelper.getRandomColor();
          console.log('response.data',response.data);
          //response.data.forEach((el) => {

            console.log('el',el);
            let corAnterior = cor;
            cor = RgbHelper.getRandomColor();
            if (corAnterior == cor)
              cor = RgbHelper.getRandomColor();
            
            //console.log('dadosPais',dadosPais);
            //if (labels.length == 0)
            labels = response.data.map((dt) => dt.dtMedicao);

            let dadosDataset = {
              label: 'Temp',
              backgroundColor: cor,
              borderColor: cor,
              data: response.data.map((temp) => temp.vlTemperatura),
              yAxisID: 'yPib'
            };
            datasets.push(dadosDataset);

            dadosDataset = {
              label: 'Umid',
              backgroundColor: cor,
              borderColor: cor,
              borderDash: [5, 5],
              data: response.data.map((umid) => umid.vlUmidade),
              yAxisID: 'yPibPerCapita'
              }; 
            datasets.push(dadosDataset);
          this.setState(prevState => ({
            ...prevState,
            data : {
              //labels: respostaComNomePaises.map((el) => el.Ano),
              labels: labels,
              /*
              datasets: [
                {
                  label: 'PIB',
                  backgroundColor: 'rgba(194, 116, 161, 0.5)',
                  borderColor: 'rgb(194, 116, 161)',
                  data: respostaComNomePaises.map((el) => el.pibTotal),
                  yAxisID: 'yPib',
                },
                {
                  label: 'PIB Per Capita',
                  backgroundColor: 'rgba(71, 225, 167, 0.5)',
                  borderColor: 'rgb(71, 225, 167)',
                  data: respostaComNomePaises.map((el) => el.pibPerCapita),
                  yAxisID: 'yPibPerCapita',
    
                },
              ]*/
              datasets: datasets
            },
            dadosGrafico : responseApi,
            filtros : {
              ...prevState.filtros
            }
          }));
        }
      })
      .catch((error) => {
        let httpServiceHandler = new HttpServiceHandler();
        httpServiceHandler.validarExceptionHTTP(error.response,this);
      })
      //this.limparFiltros();
    }


    this.checkGerarGrafico = (booleana) => {
      return booleana;
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

    this.handleChangeNumerico = (e) => {

      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        console.log('noif');
        const name = e.target.name;
        const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
        this.setState({ 
          [name]: value 
        });
      } 
    }

  
    this.limparFiltros = (e) => {
      console.log('limpando filtros');
      this.setState(prevState => ({
        ...prevState,
        filtros : {
          ...prevState.filtros,
          idPaises: [],
          minAno: null,
          maxAno: null
          }
        }
      ));
    }

    this.limparDados = (e) => {
      console.log('limpando dados');
      this.setState(prevState => ({
        ...prevState,
        dadosGrafico:[]
      }  
      )
      );
    }

  }


  

  render(){
    return (
      <div>

        <Container className="containerListaAlunosTurma" fluid>

          <Row>
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 10, offset: 1}} lg={{span: 10, offset: 1}}>
              <MenuLogado/>
            </Col>
          </Row>

          <Row>
            <Col xs={{span: 6, offset: 0}} sm={{span : 6, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <h3 className="Aluno">Dados</h3>
            </Col>
          </Row>

          <Col style={{marginTop : "60px"}} xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>

          </Col>

          {
          (this.checkGerarGrafico(true)) &&
          <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
          <Line 
            data={this.state.data} options={options} />
            </Col>
        }

          <Row style={{marginTop : "60px"}}>
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <h4>Dados de PIB Cadastrados </h4>
              <Table responsive="sm" striped bordered hover>
                <thead>
                  <tr>
                      <th>vlTemperatura</th>
                      <th>vlUmidade</th>
                      <th>dtMedicao</th>
                  </tr>
                </thead>

                <tbody>
                {
                    this.state.dadosGrafico.map((dado) => {
                    return (
                        
                      <tr key={dado.idMedicao}>
                        <td>{dado.vlTemperatura}</td>
                        <td>{dado.vlUmidade}</td>
                        <td>{dado.dtMedicao}</td>
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
            <Paginacao there={this} />
          </Container>
      </div>
    )
  }

  componentDidMount() {
      
    this.obterLista();
    
  }


}