import { Component } from "react";
import ErroDto from "../../dto/ErroDto";

export default class HttpServiceHandler  extends Component {

  constructor() {
    super();
    this.validarExceptionHTTP = (error, origemErro) => {
      let response = error.response;
      let mensagemErro = '';

      if (!response){
        origemErro.setState( prevState => ({
          erroModal : {
            ...prevState.erroModal,
            mensagemErro : 'Não foi possível conectar ao servidor de dados, verifique sua conexão de rede e se o servidor foi inicializado. (' + error.message + ')',
            show : true,
            titulo : 'Erro de Conexão'
          }
        }));
        return;
      }

      if (response.status == 422){
        
        if (Array.isArray(response.data)){
          response.data.forEach((erro) => {          
            mensagemErro += (erro.campo ? erro.campo + ' - ' : '') + erro.mensagemErro + "; ";
          })
        } else {
          mensagemErro = response.data.mensagem;
        }

      }
      else {
        mensagemErro = response.data.mensagemErro;
      }

      origemErro.setState( prevState => ({
        erroModal : {
          ...prevState.erroModal,
          mensagemErro : mensagemErro,
          show : true,
          titulo : 'Erro '+response.status
        }
      }));
  
      if (response.status == 401){
        ErroDto.setErroToken(response.data.mensagemErro);
        window.location = '/login';
      }

      
  
    }
  }
}
