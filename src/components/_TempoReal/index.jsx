import { Component } from "react";
import { Container, Table, Row, Col } from 'react-bootstrap';
import './index.css';
import HttpService from '../../services/HttpService';
import HttpServiceHandler from '../../services/HttpServiceHandler';
import DateHelper from "../../helpers/DateHelper";
import RgbHelper from "../../helpers/RgbHelper";
import ErroModal from '../ErroModal';
import Button from 'react-bootstrap/Button';
import MenuLogado from '../MenuLogado';
import { Modal } from 'react-bootstrap';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js';


ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Title);


export const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  scales: {
    yTemp: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: 'Temperatura'
      },
      suggestedMin: 15,
      suggestedMax: 50
    },
    yUmidade: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Umidade Relativa'
      },
      beginAtZero: true,
      steps: 10,
      stepValue: 5,
      max: 100,
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
      text: 'Monitoramento',
    },
  },
};


export default class TempoReal extends Component{

  constructor(props){
    super(props);

    this.state = {
      data: null,
      dadosTabela: [],
      
      filtros : {
        paginacaoRequest : {
          size: 1,
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
          if (this.state.data != null)
            labels = this.state.data.labels.slice();
          let responsesApi = this.state.dadosGrafico.slice();
          let responseApi = response.data;

          if(labels.length > 5){
            labels.pop();
            responsesApi.pop();
          }

          responsesApi.unshift(responseApi[0]);
          labels.unshift(DateHelper.extrairHoraFormatoIso(responseApi[0].dtMedicao));
          //console.log('response.data',response.data);
          console.log('responsesApi');
          console.log(responsesApi);
          //response.data.forEach((el) => {

            let cor = RgbHelper.getRandomColor();
            let cor2 = RgbHelper.getRandomColor();
            if (cor2 === cor) //extremamente improvável que dois randons gerem a mesma cor, mas só pra garantir...
              cor2 = RgbHelper.getRandomColor();
            


            let dadosDataset = {
              label: 'Temperatura',
              backgroundColor: cor,
              borderColor: cor,
              data: responsesApi.map((temp) => temp.vlTemperatura),
              yAxisID: 'yTemp'
            };
            datasets.push(dadosDataset);

            dadosDataset = {
              label: 'Umidade',
              backgroundColor: cor2,
              borderColor: cor2,
              borderDash: [5, 5],
              data: responsesApi.map((umid) => umid.vlUmidade),
              yAxisID: 'yUmidade'
              }; 
            datasets.push(dadosDataset);
            
          this.setState(prevState => ({
            ...prevState,
            data : {
              //labels: respostaComNomePaises.map((el) => el.Ano),
              labels: labels,
              datasets: datasets
            },
            dadosTabela : [this.state.dadosTabela, responseApi],
            filtros : {
              ...prevState.filtros
            }
          }));
        }
      })
      .catch((error) => {
        console.log(error);
        let httpServiceHandler = new HttpServiceHandler();
        httpServiceHandler.validarExceptionHTTP(error.response,this);
      })
      //this.limparFiltros();
    }


    this.checkGerarGrafico = (dadosGrafico) => {
      return Array.isArray(dadosGrafico) && dadosGrafico.length  > 0;
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
          (this.checkGerarGrafico(this.state.dadosGrafico)) &&
          <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
          <Line 
            data={this.state.data} options={options} />
            </Col>
        }

          <Row style={{marginTop : "60px"}}>
            <Col xs={{span: 12, offset: 0}} sm={{span : 12, offset: 0}}  md={{span : 12, offset: 0}} lg={{span: 10, offset: 1}}>
              <h4>Dados recentes de medições </h4>
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
                    this.state.dadosTabela.map((dado) => {
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
          </Container>
      </div>
    )
  }

  componentDidMount() {
      
    this.obterLista();
    setInterval(this.obterLista,2000);
    
  }


}