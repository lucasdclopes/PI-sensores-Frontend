import { Component } from "react";
import MenuLogado from "../MenuLogado";
import TempoReal from "../TempoReal";

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