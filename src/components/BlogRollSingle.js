import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import { Col, Row } from "react-styled-flexboxgrid";
import styled from "styled-components";
import ReactTimeAgo from 'react-time-ago'

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
            <article>
                <Link
                    to={post.fields.slug}
                >
                    <header>
                        {post.frontmatter.featuredimage ? (
                        <div>
                            <PreviewCompatibleImage
                            imageInfo={{
                                image: post.frontmatter.featuredimage,
                                alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                            }}
                            />
                        </div>
                        ) : null}
                        <TitleBackground>
                        <Title>
                            {post.frontmatter.title}
                        </Title>
                        <Time>
                            Posted: <ReactTimeAgo date={new Date(post.frontmatter.date)} locale="en-US"/>
                        </Time>
                        </TitleBackground>
                    </header>   
                </Link>
            </article>
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
