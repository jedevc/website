import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

import Layout from "../layouts/home"
import MDXProvider from "../mdx"
import SEO from "../components/seo"
import Socials from "../components/socials"

export default function Index({ data }) {
  const { github, twitter, linkedin, email } = data.site.siteMetadata.social
  const { body, frontmatter } = data.mdx

  return (
    <Layout>
      <SEO path="/" />
      <div className="columns">
        <div className="column content">
          <h2 className="title is-family-monospace">whoami</h2>
          {frontmatter.personal.split("\n").map(part => (
            <p>{part}</p>
          ))}
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
        personal
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
  }
`
