import './App.css';
import React, { Component } from 'react';

import MenuLogado from "./components/MenuLogado";
import TempoReal from "./components/TempoReal";

export default class AreaDoUsuario extends Component {

  constructor(props){
    super(props);

  }

  render(){
    return (
      <div>
        <MenuLogado/>
        <TempoReal/>
      </div>
    );
  }

}