import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../layouts/basic"
import MDXProvider from "../mdx"
import Seo from "../components/seo"
import Favicons from "../components/favicons"
import Dropdown from "../components/dropdown"

export default function Page({ data }) {
  const page = data.mdx

  const description = page.frontmatter.description || page.excerpt

  return (
    <Layout>
      <Favicons />
      <Seo
        title={page.frontmatter.title}
        description={description}
        path={page.fields.slug}
      />
      <Dropdown path={page.fields.path} />
      {page.frontmatter.title && (
        <h1 className="title">{page.frontmatter.title}</h1>
      )}
      <div className="content">
        <MDXProvider>
          <MDXRenderer>{page.body}</MDXRenderer>
        </MDXProvider>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt
      frontmatter {
        title
        description
      }
      fields {
        slug
        path
      }
    }
  }
`
