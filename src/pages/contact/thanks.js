import React from 'react'
import Layout from '../../components/Layout'
import { Grid, Col, Row } from "react-styled-flexboxgrid";

export default () => (
  <Layout>
    <section>
      <Grid>
        <Row>
          <Col xs={12}>
            <h1>So great to hear from you!</h1>
            <p>I will be in touch ASAP.</p>
          </Col>
        </Row>
      </Grid>
    </section>
  </Layout>
)
