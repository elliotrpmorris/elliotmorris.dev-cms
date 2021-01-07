import React from 'react'
import { Grid, Col, Row } from "react-styled-flexboxgrid";
import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <Grid>
          <h1>
            Latest Articles
          </h1>
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
