import axios from 'axios';
import UsuarioLogadoDto from '../../dto/UsuarioLogadoDto';

const host = window.location.protocol + "//" + window.location.host;
//const urlBase = 'http://192.168.0.143:8080/PI-sensores/api'; //<- testes local
const urlBase = 'http://localhost:8080/api'; //<- testes local
//const urlBase = host + '/api'; //<- build acesso na rede
const defaultHeaders = {
  headers : {
    "Content-Type": "application/json",
    "Accept-Language" : "pt-br"
    //,"token" : UsuarioLogadoDto.getTokenAcesso() ? UsuarioLogadoDto.getTokenAcesso() : ""
  }
}
const defaultConfig = {
  headers : defaultHeaders.headers 
}

export default class HttpService{

  static queryPaginacao = (paginacao) => {
    return (!paginacao.size || !paginacao.page) ? 
      '' : 
      'size=' + paginacao.size + '&page=' + (paginacao.page); 
  } 
  static gerarParams = (arrParams) => {
    return (arrParams.length > 0) ? 
      '?'+arrParams.join('&'):'';
  }

  static listarMedicoes = async (filtros) => {
    //console.log(filtros);
    let url = urlBase + '/medicao';
    let queryParams = [];

    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(
        filtros.paginacaoRequest
        ));
    }

    if (filtros.dtInicial) {
      queryParams.push('dtInicial=' + filtros.dtInicial);
    }
    if (filtros.dtFinal) {
      queryParams.push('dtFinal=' + filtros.dtFinal);
    }
    if (filtros.tempoReal) {
      queryParams.push('tempoReal=' + filtros.tempoReal);
    }
    if (filtros.tipoAgrupamento && filtros.tipoAgrupamento > 0) {
      queryParams.push('tipoAgrupamento=' + filtros.tipoAgrupamento);
    }
    

    url += HttpService.gerarParams(queryParams);

    //console.log("url -> ",url);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static listarAlertas = async (filtros) => {

    let url = urlBase + '/alerta';
    let queryParams = [];

    if (filtros.paginacaoRequest) {
      
      queryParams.push(HttpService.queryPaginacao(
        filtros.paginacaoRequest
        ));
    }

    url += HttpService.gerarParams(queryParams);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static listarAlertasEnviados = async (idAlerta) => {

    let url = urlBase + '/alerta/' + idAlerta;

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static salvarAlerta =  (postData,idAlerta) => {
    let isUpdate = false
    if (typeof idAlerta !== 'undefined' && idAlerta > 0) {
      isUpdate = true;
    }
    let url = urlBase + '/alerta/'+ ((isUpdate)? ""+idAlerta :"") ;
    let config = defaultConfig;
    
    if (isUpdate) {
      return axios.put(url,postData,config);
    } else {
      return axios.post(url,postData,config);
    }
      
  }

  static deletarAlerta = async (idAlerta) => {
    let url = urlBase + '/alerta/' +idAlerta;
    let response = await axios.delete(url,defaultConfig);
    return response;
  }

  static logar = (postData) => {
    return axios.post(urlBase + '/logar', postData,defaultHeaders);
  }

}