import React from "react"
import { graphql } from "gatsby"

import { Layout, Section } from "../layouts/basic"

import { Post } from "../components/post"
import SEO from "../components/seo"
import Dropdown from "../components/dropdown"

export default function BlogPost({ data }) {
  const post = data.markdownRemark

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        path={post.fields.slug}
      />
      <Section>
        <Dropdown path={post.fields.path} />
        <Post
          title={post.frontmatter.title}
          date={post.frontmatter.date}
          content={post.html}
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
        date
      }
      fields {
        slug
        path
      }
    }
  }
`
