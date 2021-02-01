import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import { Grid, Col, Row } from "react-styled-flexboxgrid";
import styled from "styled-components";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 1;
  position: relative;
  padding: 1.5rem;
  background-color: #d8d8d8;
  color: black;
  @media (min-width: 768px) {
    padding: 5rem;
  }

  &:hover {
    &::before {
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
        0 10px 10px rgba(0, 0, 0, 0.22);
      transform: rotate(2deg) scale(1.01);
    }
  }
  &::before {
    content: " ";
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
    transform: rotate(-2deg);
    box-shadow: -1px 1px 24px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
  }

    &::before {
      background-color: #d8d8d8;
    }
  }
`;

export const AboutPageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <section>
      <Grid>
        <Row>
          <Col xs={12}>
            <Card>
              <h1>
                {title}
              </h1>
              <PageContent content={content} />
            </Card>
          </Col>
        </Row>
      </Grid>
    </section>
  )
}

AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data

  return (
    <Layout>
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  )
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default AboutPage

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
