import React from "react"
import { graphql, Link } from "gatsby"
import { FaRss } from "react-icons/fa"

import Layout from "../layouts/basic"
import { PostPreview } from "../components/post"
import Seo from "../components/seo"
import Favicons from "../components/favicons"

export default function Blog({ data }) {
  const { nodes } = data.allMdx

  return (
    <Layout>
      <Favicons />
      <Seo title="Blog" path="/blog/" />

      <div className="is-pulled-right">
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="button"
        >
          <span className="icon">
            <FaRss />
          </span>
          <span>Feed</span>
        </a>
      </div>

      <h1 className="title">My Blog</h1>

      <div>
        {nodes.map(node => (
          <Link key={node.id} to={node.fields.slug}>
            <PostPreview
              style={{ marginBottom: "1rem" }}
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
    allMdx(
      filter: {
        fields: { type: { eq: "post" } }
        frontmatter: { hidden: { ne: true } }
      }
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
