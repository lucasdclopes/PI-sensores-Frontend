import { Component } from "react";

export default class ErroDto extends Component {

  static setErroToken = (erroToken) => {
    window.sessionStorage.setItem('erroToken',erroToken);
  }

  static getErroToken = () => {
    return window.sessionStorage.getItem('erroToken');
  }

  static deleteErroToken = () => {
    window.sessionStorage.removeItem('erroToken')
  }  
}