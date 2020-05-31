import React from "react"
import { graphql } from "gatsby"

import { Layout, Section } from "../layouts/basic"

export default function BlogPost({ data }) {
  const page = data.markdownRemark

  return (
    <Layout>
      <Section>
        <h2 className="title">{page.frontmatter.title}</h2>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </Section>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
