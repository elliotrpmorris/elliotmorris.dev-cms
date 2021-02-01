import React from "react";
import styled from "styled-components";
import { Grid, Col, Row } from "react-styled-flexboxgrid";
import Layout from "../components/Layout";
import Typewriter from 'typewriter-effect';
import BlogRollSingle from "../components/BlogRollSingle";
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

export const SubTitle = styled.h2`
  display: flex;
  justify-content: left;
  text-align: left;

  @media (min-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;

export const Title = styled.h1`
  display: flex;
  flex-wrap: wrap;  
`;

export const Background = styled.div`
  background-color: #d8d8d8;
  padding: 1.25rem;

`;

export const IndexPageTemplate = () => (
  <section>
    <Grid>
      <Row>
        <Col xs={12}>
          <Background>
            <Title>
             <span style={{flexBasis: "100%"}}>Hey, I'm Elliot!</span> 
             <span style={{flexBasis: "100%"}}>
              <Typewriter
                options={{
                  strings: ['An engineer.', 'An architect.', 'A consultant.'],
                  autoStart: true,
                  loop: true,
                }}
                
              />
              </span> 
            </Title>
            <SubTitle>Or what ever you'd like to call me... Im here to solve your technology & engineering problems!</SubTitle>
          </Background>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h3>My latest piece</h3>
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
