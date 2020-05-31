import React from "react"
import { graphql, Link } from "gatsby"

import { Layout, Section } from "../layouts/basic"

import { PostPreview } from "../components/post"

export default function Blog({ data }) {
  const { edges } = data.allMarkdownRemark

  return (
    <Layout>
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
    allMarkdownRemark {
      edges {
        node {
          id
          excerpt
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
