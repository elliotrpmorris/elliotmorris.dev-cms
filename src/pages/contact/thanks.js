import React from 'react'
import Layout from '../../components/Layout'
import styled from "styled-components";
import { Grid, Col, Row } from "react-styled-flexboxgrid";

export const Title = styled.h1`
  line-height: 1;
  margin: 0.5rem 0;
  font-size: 2.5rem;
`;

export default () => (
  <Layout>
    <section>
      <Grid>
        <Row>
          <Col xs={12}>
            <Title>Great to hear from you!</Title>
            <p>I will be in touch ASAP.</p>
          </Col>
        </Row>
      </Grid>
    </section>
  </Layout>
)
