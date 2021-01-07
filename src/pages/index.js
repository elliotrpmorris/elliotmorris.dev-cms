import React from "react";
import styled from "styled-components";
import { Grid, Col, Row } from "react-styled-flexboxgrid";
import Layout from "../components/Layout";
import Typewriter from 'typewriter-effect';
import BlogRollSingle from "../components/BlogRollSingle";
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

export const SubTitle = styled.p`
  color: #20232a;
  display: flex;
  justify-content: center;
  text-align: center;

  font-size: 1.25rem;
`;

export const Title = styled.h1`
  color: #20232a;
  display: flex;
  justify-content: center;
  font-size: 2rem;
  @media (min-width: 360px) {
    font-size: 2rem;
  }
  @media (min-width: 1270px) {
    font-size: 4.5rem;
  }
`;

export const Background = styled.div`
  background-color: #d8d8d8;
  padding: 1.5rem;
`;

export const IndexPageTemplate = () => (
  <section>
    <Grid>
      <Row>
        <Col xs={12}>
          <Background>
            <Title>
              Hey, I'm Elliot!&nbsp;
              <Typewriter
                options={{
                  strings: ['An engineer.', 'An architect.', 'A consultant.'],
                  autoStart: true,
                  loop: true,
                }}
              />
            </Title>
            <SubTitle>Or what ever you'd like to call me... Im here to solve your technology & engineering problems!</SubTitle>
          </Background>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h2>My latest piece</h2>
          <BlogRollSingle />
        </Col>
      </Row>
    </Grid>
  </section>
);

const IndexPage = () => {
  return (
    <Layout>
      <IndexPageTemplate />
    </Layout>
  );
};

export default IndexPage;
