import React from 'react'
import PropTypes from 'prop-types'
import { graphql, StaticQuery } from 'gatsby'
import { Col, Row } from "react-styled-flexboxgrid";
import styled from "styled-components";
import BlogPost from '../components/BlogPost'

export const TitleBackground = styled.div`
  background-color: #c2c2c2;
  padding: .75rem;
  text-align: center;
`;

export const Time = styled.div`
    text-align: right;
`;

export const Title = styled.h3`
    margin: 0 0 .5rem 0;
`;

class BlogRollSingle extends React.Component {
    render() {
      const { data } = this.props
      const { node: post } = data.allMarkdownRemark.edges[0]

    return (
      <Row>
        <Col xs={12} sm={6} md={4}>
           <BlogPost post={post} />
        </Col>
      </Row>
    )
  }
}

BlogRollSingle.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollSingleQuery {
         allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
          limit: 1
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 120, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data) => <BlogRollSingle data={data} />}
  />
)
