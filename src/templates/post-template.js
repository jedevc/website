import React from "react"
import { graphql } from "gatsby"

import Layout from "../layouts/basic"

import { Post } from "../components/post"
import SEO from "../components/seo"
import Dropdown from "../components/dropdown"

export default function BlogPost({ data }) {
  const post = data.mdx

  const description = post.frontmatter.description || post.excerpt

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={description}
        path={post.fields.slug}
      />
      <Dropdown path={post.fields.path} />
      <Post
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        content={post.body}
      />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt
      frontmatter {
        title
        description
        date
      }
      fields {
        slug
        path
      }
    }
  }
`
