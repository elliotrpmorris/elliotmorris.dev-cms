import React from "react";
import styled from "styled-components";
import { Grid, Col, Row } from "react-styled-flexboxgrid";
import Layout from "../components/Layout";

export const SubTitle = styled.p`
  color: #20232a;
  display: flex;
  justify-content: center;
`;

export const Title = styled.h1`
  color: #20232a;
  display: flex;
  justify-content: center;
  animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1) both,
    wobble-hor-bottom 1.5s both;
  font-size: 3.2rem;
  @media (min-width: 360px) {
    font-size: 3.5rem;
  }
  @media (min-width: 415px) {
    font-size: 4.5rem;
  }
  @keyframes tracking-in-expand {
    0% {
      letter-spacing: -0.5em;
      opacity: 0;
    }
    40% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes wobble-hor-bottom {
    0%,
    100% {
      -webkit-transform: translateX(0%);
      transform: translateX(0%);
      -webkit-transform-origin: 50% 50%;
      transform-origin: 50% 50%;
    }
    15% {
      -webkit-transform: translateX(-30px) rotate(-6deg);
      transform: translateX(-30px) rotate(-6deg);
    }
    30% {
      -webkit-transform: translateX(15px) rotate(6deg);
      transform: translateX(15px) rotate(6deg);
    }
    45% {
      -webkit-transform: translateX(-15px) rotate(-3.6deg);
      transform: translateX(-15px) rotate(-3.6deg);
    }
    60% {
      -webkit-transform: translateX(9px) rotate(2.4deg);
      transform: translateX(9px) rotate(2.4deg);
    }
    75% {
      -webkit-transform: translateX(-6px) rotate(-1.2deg);
      transform: translateX(-6px) rotate(-1.2deg);
    }
  }
`;

export const IndexPageTemplate = () => (
  <section>
    <Grid>
      <Row>
        <Col xs={12}>
          <Title>
            Clandestine <br />
            Labs
          </Title>
        </Col>
        <Col xs={12}>
          <SubTitle>Bespoke web development services.</SubTitle>
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
