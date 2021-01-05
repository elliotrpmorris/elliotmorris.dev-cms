import React from 'react'
import twitter from '../img/social/twitter.svg'
import { Grid, Col, Row } from "react-styled-flexboxgrid";

const Footer = class extends React.Component {
  render() {
    return (
      <footer>
        <Grid>
          <Row>
            <Col xs={12}>
              <a title="twitter" href="https://twitter.com">
                <img
                  className="fas fa-lg"
                  src={twitter}
                  alt="Twitter"
                  style={{ width: '1em', height: '1em' }}
                />
              </a> 
            </Col>
          </Row>
        </Grid>
      </footer>
    )
  }
}

export default Footer
