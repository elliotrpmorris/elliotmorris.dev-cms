import React from 'react'
import { Grid } from "react-styled-flexboxgrid";
import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'
import styled from "styled-components";

export const Title = styled.h1`
  line-height: 1;
  margin: 0.5rem 0;
  font-size: 2.5rem;
`;

export const SubTitle = styled.h2`
  color: #20232a;
  margin-bottom: 1.5rem;
  font-size: .5rem;

  @media (min-width: 360px) {
    font-size: .75rem;
  }
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <Grid>
          <Title>
            Blog
          </Title>
          <SubTitle>
            Here you will find me talking about what i've been getting up too.
          </SubTitle>
        <section>
          <div>
            <div>
              <BlogRoll />
            </div>
          </div>
        </section>
        </Grid>
      </Layout>
    )
  }
}
