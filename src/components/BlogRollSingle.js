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
        const { markdownRemark : post } = data

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
    markdownRemark: PropTypes.object
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollSingleQuery {
        markdownRemark{
            id
            excerpt(pruneLength: 400)
            fields {
                slug
            }
            frontmatter{
            title
            featuredpost
            featuredimage {
                childImageSharp {
                fluid(maxWidth: 240, quality: 100) {
                    ...GatsbyImageSharpFluid
                }
                }
            }
            tags
            date
            description
            }
        }
      }
    `}
    render={(data) => <BlogRollSingle data={data} />}
  />
)
