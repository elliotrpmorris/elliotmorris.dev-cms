import React from 'react'
import { Link} from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import styled from "styled-components";
import ReactTimeAgo from 'react-time-ago'

export const TitleBackground = styled.div`
  background-color: #c2c2c2;
  padding: .75rem;
  text-align: center;
`;

export const Post = styled.article`
  margin-bottom: 1.5rem;
`;

export const Time = styled.div`
    text-align: right;
`;

export const Title = styled.h3`
    margin: 0 0 .5rem 0;
`;

export default class BlogPost extends React.Component {
    render() {

    return (
        <Post>
            <Link
                to={this.props.post.fields.slug}
            >
                <header>
                    {this.props.post.frontmatter.featuredimage ? (
                    <div>
                        <PreviewCompatibleImage
                        imageInfo={{
                            image: this.props.post.frontmatter.featuredimage,
                            alt: `featured image thumbnail for post ${this.props.post.frontmatter.title}`,
                        }}
                        />
                    </div>
                    ) : null}
                    <TitleBackground>
                    <Title>
                        {this.props.post.frontmatter.title}
                    </Title>
                    <Time>
                        Posted: <ReactTimeAgo date={new Date(this.props.post.frontmatter.date)} locale="en-US"/>
                    </Time>
                    </TitleBackground>
                </header>   
            </Link>
        </Post>  
    )
  }
}