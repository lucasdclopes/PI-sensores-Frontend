import axios from 'axios';
import UsuarioLogadoDto from '../../dto/UsuarioLogadoDto';

const host = window.location.protocol + "//" + window.location.host;
const urlBase = 'http://localhost:8080/PI-sensores/api'; //<- testes local
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
      'size=' + paginacao.size + '&page=' + (paginacao.page - 1); 
  } 
  static gerarParams = (arrParams) => {
    return (arrParams.length > 0) ? 
      '?'+arrParams.join('&'):'';
  }

  static listarMedicoes = async (filtros) => {
    console.log('filtros listarMedicoes',filtros);
    let url = urlBase + '/medicao';
    let queryParams = [];

    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(
        filtros.paginacaoRequest
        ));
    }

    url += HttpService.gerarParams(queryParams);

    //console.log("url -> ",url);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static listarPaises = async (filtros) => {
    console.log('filtros listarPaises',filtros);
    let url = urlBase + '/pais';
    let queryParams = [];

    if (filtros.idPais) {
      queryParams.push('idPais=' + filtros.minAno);
    }

    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(
        filtros.paginacaoRequest
        ));
    }

    url += HttpService.gerarParams(queryParams);

    //console.log("url -> ",url);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static listarPibPaises = async (filtros) => {
    console.log('filtros listarPibPaises',filtros);
    let url = urlBase + '/pib';
    let queryParams = [];

    if (filtros.idPaises) {
      filtros.idPaises.forEach((idPais) => {
        queryParams.push('idPais=' + idPais);
      })
    }

    if (filtros.minAno) {
      queryParams.push('minAno=' + filtros.minAno);
    }
    if (filtros.maxAno) {
      queryParams.push('maxAno=' + filtros.maxAno);
    }

    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(
        filtros.paginacaoRequest
        ));
    }

    url += HttpService.gerarParams(queryParams);

    console.log("url listarPibPaises ",url);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static listarCo2Paises = async (filtros) => {
    console.log('filtros listarCo2Paises',filtros);
    let url = urlBase + '/co2';
    let queryParams = [];

    if (filtros.idPaises) {
      filtros.idPaises.forEach((idPais) => {
        queryParams.push('idPais=' + idPais);
      })
    }

    if (filtros.minAno) {
      queryParams.push('minAno=' + filtros.minAno);
    }
    if (filtros.maxAno) {
      queryParams.push('maxAno=' + filtros.maxAno);
    }

    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(
        filtros.paginacaoRequest
        ));
    }

    url += HttpService.gerarParams(queryParams);

    console.log("url listarCo2Paises ",url);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static calcularPibCo2Paises = async (filtros) => {
    console.log('filtros calcularPibCo2Paises',filtros);
    let url = urlBase + '/pib/calc-co2';
    let queryParams = [];

    if (filtros.idPaises) {
      filtros.idPaises.forEach((idPais) => {
        queryParams.push('idPais=' + idPais);
      })
    }

    if (filtros.minAno) {
      queryParams.push('minAno=' + filtros.minAno);
    }
    if (filtros.maxAno) {
      queryParams.push('maxAno=' + filtros.maxAno);
    }
    if (filtros.isCo2PerCapita) {
      queryParams.push('isCo2PerCapita=' + filtros.isCo2PerCapita);
    }


    url += HttpService.gerarParams(queryParams);

    console.log("url calcularPibCo2Paises ",url);

    let response = await axios.get(url,defaultConfig);
    return response;
  }
  
  static listarCalendarioAulas = async (filtros) => {
    let url = urlBase + '/calendario-aulas';
    let queryParams = [];

    if (filtros.diaSemana){
      const d = new Date();
      const weekday = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];
      let day = weekday[d.getDay()];
      queryParams.push('diaSemana=' + day);
    }

    if (filtros.idProfessor) {
      queryParams.push('idProfessor=' + filtros.idProfessor);
    }

    if (filtros.idTurma) {
      queryParams.push('idTurma=' + filtros.idTurma);
    }

    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(filtros.paginacaoRequest));
    }

    url += HttpService.gerarParams(queryParams);

    let response = await axios.get(url,defaultConfig);
    return response;
  }
  static iniciarAula =  (postData) => {
    let url = urlBase + '/aulas';
    let config = defaultConfig;
    
    return axios.post(url,postData,config);
  }

  static salvarChamadaAtual = (idAula, listaChamada) => {

    let json = [];

    listaChamada.forEach((dadosAluno) => {
      json.push({
        idAluno : dadosAluno.aluno.idCadastro,
        isPresente : dadosAluno.presente === null ? true : dadosAluno.presente
      });
    })

    let url = urlBase + '/aulas/'+idAula+"/presencas";
    let config = defaultConfig;
    
    return axios.put(url,json,config);
  }

  static finalizarAula = (idAula) => {
    let url = urlBase + '/aulas/'+idAula+"/finalizar";
    let config = defaultConfig;
    return axios.put(url,{},config);
  }

  static logar = (postData) => {
    return axios.post(urlBase + '/logar', postData,defaultHeaders);
  }

  static listarTurmas = async (filtros) => {
    let url = urlBase + '/turmas';
    let queryParams = [];

    if (filtros.descTurma) {
      queryParams.push('descTurma=' + filtros.descTurma);
    }
    if (filtros.tpPeriodo) {
      queryParams.push('tpPeriodo=' + filtros.tpPeriodo);
    }
    if (filtros.tpNivelEnsino) {
      queryParams.push('tpNivelEnsino=' + filtros.tpNivelEnsino);
    }
    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(filtros.paginacaoRequest));
    }

    url += HttpService.gerarParams(queryParams);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static exibirTurma = async (idTurma) => {
    let url = urlBase + '/turmas/' +idTurma;
    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static deletarTurma = async (idTurma) => {
    console.log("vou deletar a turma "+idTurma);
    let url = urlBase + '/turmas/' +idTurma;
    let response = await axios.delete(url,defaultConfig);
    return response;
  }


  static deletarAlunoTurma = async (idTurma, idAluno) => {
    console.log("vou deletar o aluno" + idAluno + " da turma "+idTurma);
    let url = urlBase + '/turmas/' +idTurma + "/aluno/" + idAluno;
    let response = await axios.delete(url,defaultConfig);
    return response;
  }

  static addAlunoTurma = async (idTurma, idAluno) => {
    console.log("vou add o aluno" + idAluno + " na turma "+idTurma);
    let url = urlBase + '/turmas/' +idTurma + "/aluno/" + idAluno;
    let response = await axios.put(url,null,defaultConfig);
    return response;
  }

  static salvarTurma =  (postData) => {
    let url = urlBase + '/turmas';
    let config = defaultConfig;
    return axios.post(url,postData,config);
  }

  static exibirAluno = async (idAluno) => {
    let url = urlBase + '/alunos/' +idAluno;
    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static calcularFaltasAluno = async (idAluno) => {
    let url = urlBase + '/alunos/' +idAluno + '/calculo-faltas';
    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static listarAlunos = async (filtros) => {
    let url = urlBase + '/alunos';
    let queryParams = [];

    if (filtros.cpf) {
      queryParams.push('cpf=' + filtros.cpf);
    }
    if (filtros.nome) {
      queryParams.push('nome=' + filtros.nome);
    }
    if (filtros.nomeMae) {
      queryParams.push('nomeMae=' + filtros.nomeMae);
    }
    if (filtros.nomePai) {
      queryParams.push('nomePai=' + filtros.nomePai);
    }
    if (filtros.nis) {
      queryParams.push('nis=' + filtros.nis);
    }
    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(filtros.paginacaoRequest));
    }

    url += HttpService.gerarParams(queryParams);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static deletarAluno = async (idAluno) => {
    console.log("vou deletar o aluno "+idAluno);
    let url = urlBase + '/alunos/' +idAluno;
    let response = await axios.delete(url,defaultConfig);
    return response;
  }

  static salvarAluno =  (postData,idAluno) => {
    let url = urlBase + '/alunos/'+ ((idAluno && idAluno != 0) ? idAluno : "");
    let config = defaultConfig;
    if (idAluno != 0) {
      return axios.put(url,postData,config);
    }
    else {
      return axios.post(url,postData,config);
    }
  }

  static exibirAluno = async (idAluno) => {
    let url = urlBase + '/alunos/' +idAluno;
    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static listarBeneficios = async (filtros) => {
    let url = urlBase + '/beneficios';
    let queryParams = [];

    if (filtros.cpf) {
      queryParams.push('idAluno=' + filtros.idAluno);
    }
    if (filtros.nome) {
      queryParams.push('dtRecebimentoInicio=' + filtros.dtRecebimentoInicio);
    }
    if (filtros.nomeMae) {
      queryParams.push('dtRecebimentoFim=' + filtros.dtRecebimentoFim);
    }
    if (filtros.nomePai) {
      queryParams.push('responsavelRecebimento=' + filtros.responsavelRecebimento);
    }
    if (filtros.paginacaoRequest) {
      queryParams.push(HttpService.queryPaginacao(filtros.paginacaoRequest));
    }

    url += HttpService.gerarParams(queryParams);

    let response = await axios.get(url,defaultConfig);
    return response;
  }

  static deletarBeneficio = async (idBeneficio) => {
    console.log("vou deletar o benefício "+idBeneficio);
    let url = urlBase + '/beneficios/' +idBeneficio;
    let response = await axios.delete(url,defaultConfig);
    return response;
  }

  static salvarBeneficio = (postData,idBeneficio) => {
    let url = urlBase + '/beneficios/'+ ((idBeneficio && idBeneficio != 0) ? idBeneficio : "");
    let config = defaultConfig;
    if (idBeneficio != 0) {
      return axios.put(url,postData,config);
    }
    else {
      return axios.post(url,postData,config);
    }
  }

  static exibirBeneficio = async (idBeneficio) => {
    let url = urlBase + '/beneficios/' +idBeneficio;
    let response = await axios.get(url,defaultConfig);
    return response;
  }
}