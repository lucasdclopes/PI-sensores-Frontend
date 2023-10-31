import { Component } from "react"
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class Paginacao extends Component {
    constructor(props){
        super(props)
    }

    

    render(){
        return (
            <Row>
                <Col xs={{span: 12, offset: 0}} sm={{span : 10, offset: 1}}  md={{span : 10, offset: 1}} lg={{span: 4, offset: 4}}>
                    <Pagination>
                        <Pagination.First onClick={() => {this.props.there.selecionarPagina(1)}} />
                        <Pagination.Prev onClick={() => {this.props.there.incrementarPagina(-1)}} />
                        <Pagination.Item active>{this.props.there.state.filtros.paginacaoRequest.page}</Pagination.Item>
                        
                        {
                        (this.props.there.state.filtros.paginacaoResponse.hasProxima) &&
                        <Pagination.Next onClick={() => {this.props.there.incrementarPagina(1)}} />
                        }
                        {
                        (!this.props.there.state.filtros.paginacaoResponse.hasProxima) &&
                        <Pagination.Next disabled />
                        }
                        <Pagination.Last onClick={() => this.props.there.selecionarPagina(this.props.there.state.filtros.paginacaoResponse.quantidade)} />
                    </Pagination>
                </Col>
            </Row>
        );
    }

}