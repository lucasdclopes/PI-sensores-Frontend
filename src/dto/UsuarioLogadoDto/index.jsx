import { Component } from "react";


// Usando sessionStorage aqui após pesquisar sobre a melhor maneira de utilizar sessão com o React.
export default class UsuarioLogadoDto extends Component {

  static setDadosUsuarioLogado = (dadosLogin, emailLogin) => {
    window.sessionStorage.setItem('tokenAcesso',dadosLogin.tokenAcesso);
    window.sessionStorage.setItem('idCadastro',dadosLogin.idCadastro);
    window.sessionStorage.setItem('nome',dadosLogin.nome);
    window.sessionStorage.setItem('emailLogin',emailLogin);
    window.sessionStorage.setItem('tipoCadastro',dadosLogin.tipoCadastro);
  }

  static logoff = () => {
    window.sessionStorage.clear();
  }

  static getTokenAcesso = () => {
    return window.sessionStorage.getItem('tokenAcesso');
  }

  static getEmailLogin = () => {
    return window.sessionStorage.getItem('emailLogin');
  }

  static getIdCadastro = () => {
    return window.sessionStorage.getItem('idCadastro');
  }

  static getNome = () => {
    return window.sessionStorage.getItem('nome');
  }

  static getTipoCadastro = () => {
    return window.sessionStorage.getItem('tipoCadastro');
  }
}