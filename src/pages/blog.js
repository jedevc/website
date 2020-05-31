import React from "react"
import { graphql, Link } from "gatsby"

import { Layout, Section } from "../layouts/basic"
import { PostPreview } from "../components/post"
import SEO from "../components/seo"

export default function Blog({ data }) {
  const { edges } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO title="Blog" path="/blog" />
      <Section>
        <div>
          {edges.map(({ node }) => (
            <Link key={node.id} to={node.fields.slug}>
              <PostPreview
                title={node.frontmatter.title}
                date={node.frontmatter.date}
                summary={node.excerpt}
              />
            </Link>
          ))}
        </div>
      </Section>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { type: { eq: "post" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 240)
          frontmatter {
            title
            date
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
