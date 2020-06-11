import React from "react"
import { graphql, Link } from "gatsby"

import Layout from "../layouts/basic"
import { PostPreview } from "../components/post"
import SEO from "../components/seo"

export default function Blog({ data }) {
  const { nodes } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO title="Blog" path="/blog/" />
      <div>
        {nodes.map(node => (
          <Link key={node.id} to={node.fields.slug}>
            <PostPreview
              title={node.frontmatter.title}
              date={node.frontmatter.date}
              summary={node.frontmatter.description || node.excerpt}
            />
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { fields: { type: { eq: "post" } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        id
        excerpt(pruneLength: 240)
        frontmatter {
          title
          description
          date
        }
        fields {
          slug
        }
      }
    }
  }
`
