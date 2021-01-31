import React from 'react'
import { Grid, Col, Row } from "react-styled-flexboxgrid";
import styled from "styled-components";
import { faGithub, faLinkedin, } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Link = styled.a`
    text-align: center;
    text-deceration: none;
`;

export const FooterWrapper = styled.div`
  text-align: center;
  margin-top 1.5rem;
  margin-bottom: 1rem;
`;

export const Icon = styled(FontAwesomeIcon)`
  color: #323741;
  margin: 0 .5rem;
  :hover{
    animation: text-shadow-pop-bottom 0.6s both;
    color: #d7d3cb;
    transition: color .2s linear;
  }
  @keyframes text-shadow-pop-bottom {
    0% {
      text-shadow: 0 0 #555555, 0 0 #555555, 0 0 #555555, 0 0 #555555;
      -webkit-transform: translateY(0);
              transform: translateY(0);
    }
    100% {
      text-shadow: 0 1px #555555, 0 2px #555555, 0 3px #555555, 0 4px #555555;
      -webkit-transform: translateY(-4px);
              transform: translateY(-4px);
    }
  }
`;
const Footer = class extends React.Component {
  render() {
    return (
      <FooterWrapper>
        <footer>
          <Grid>
            <Row middle="md">
                <Col xs={12}>
                  <Link href="https://github.com/elliotrpmorris">
                    <Icon style={{width: '28px', height: '28px'}} icon={faGithub}/>
                  </Link>
                  <Link href="https://www.linkedin.com/in/elliotrpmorris/">
                    <Icon style={{width: '24.5px', height: '28px'}} icon={faLinkedin}/>
                  </Link>
                </Col>
            </Row>
          </Grid>
        </footer>
      </FooterWrapper>
    )
  }
}

export default Footer
