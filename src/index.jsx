import { Component } from "react";
import MenuLogado from "../MenuLogado";
import Pib from "../Pib";

export default class AreaDoUsuario extends Component {

  constructor(props){
    super(props);

  }

  render(){
    return (
      <div>
        <MenuLogado/>
        <Pib/>
      </div>
    );
  }

}