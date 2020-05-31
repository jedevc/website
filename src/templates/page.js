import React from "react"
import { graphql } from "gatsby"

import { Layout, Section } from "../layouts/basic"
import SEO from "../components/seo"

export default function BlogPost({ data }) {
  const page = data.markdownRemark

  return (
    <Layout>
      <SEO
        title={page.frontmatter.title}
        description={page.excerpt}
        path={page.fields.slug}
      />
      <Section>
        <h1 className="title">{page.frontmatter.title}</h1>
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
      excerpt
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`
