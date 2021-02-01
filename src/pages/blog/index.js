import React from 'react'
import { Grid } from "react-styled-flexboxgrid";
import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'

export default class BlogIndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <Grid>
          <h1>
            Blog
          </h1>
          <p>
            Here you will find me talking about what i've been getting up too.
          </p>
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
