import React  from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import imgComputador from '../../assets/images/computador_branco.png';

const Footer = () => {

    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className="footer paddingContainer text-center">
          <img style={{width : "50%"}} src={imgComputador} />
          <p id="copyright">&copy; Copyright BLR - 2021</p>            
        </Col>          
      </Row>
    ) 
}

export default Footer;