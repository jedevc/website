import React from "react"
import { graphql } from "gatsby"

import { Layout, Section } from "../layouts/basic"

import { Post } from "../components/post"

export default function BlogPost({ data }) {
  const post = data.markdownRemark

  return (
    <Layout>
      <Section>
        <Post title={post.frontmatter.title} date={post.frontmatter.date} content={post.html} />
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
        date
      }
    }
  }
`