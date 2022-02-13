import React from "react"
import { graphql, Link } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../layouts/home"
import MDXProvider from "../mdx"
import Seo from "../components/seo"
import Socials from "../components/socials"
import { PostPreview } from "../components/post"

export default function Index({ data }) {
  const { github, twitter, linkedin, email } = data.site.siteMetadata.social
  const { body, frontmatter } = data.mdx
  const posts = data.allMdx

  return (
    <Layout>
      <Seo path="/" />
      <div className="columns">
        <div className="column content">
          <h2 className="title is-family-monospace">whoami</h2>
          <MDXProvider>
            <MDXRenderer>{frontmatter.sections[0].content}</MDXRenderer>
          </MDXProvider>
        </div>
        <div className="column">
          <Socials
            github={github}
            twitter={twitter}
            linkedin={linkedin}
            email={email}
          />
        </div>
      </div>
      <div className="content">
        <MDXProvider>
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </div>
      <div className="content">
        <h3 className="title">From my blog</h3>
      </div>
      <div className="custom-grid">
        {posts.nodes.map(node => (
          <div key={node.id} className="custom-grid-item">
            <Link to={node.fields.slug} className="is-fullheight">
              <PostPreview
                className="is-fullheight"
                title={node.frontmatter.title}
                date={node.frontmatter.date}
                summary={node.frontmatter.description || node.excerpt}
                small={true}
              />
            </Link>
          </div>
        ))}
      </div>
      <Link to="/blog" className="is-pulled-right">
        See more...
      </Link>
    </Layout>
  )
}

export const query = graphql`
  query ($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt
      frontmatter {
        sections {
          content
        }
      }
      fields {
        slug
        path
      }
    }
    site {
      siteMetadata {
        social {
          github
          twitter
          linkedin
          email
        }
      }
    }
    allMdx(
      filter: {
        fields: { type: { eq: "post" } }
        frontmatter: { hidden: { ne: true } }
      }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 3
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
