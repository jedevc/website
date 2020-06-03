import React from "react"
import { graphql } from "gatsby"

import Layout from "../layouts/home"
import Socials from "../components/socials"
import SEO from "../components/seo"

export default function Index({ data }) {
  const { github, twitter, linkedin, email } = data.site.siteMetadata.social
  const sections = data.markdownRemark.html.split("<hr>")

  const sectionsView = sections.map((section, index) => (
    <div
      key={index}
      className="content"
      dangerouslySetInnerHTML={{ __html: section }}
    />
  ))

  return (
    <Layout>
      <SEO path="/" />
      <div className="columns">
        <div className="column content">{sectionsView[0]}</div>
        <div className="column">
          <Socials
            github={github}
            twitter={twitter}
            linkedin={linkedin}
            email={email}
          />
        </div>
      </div>
      {sectionsView.slice(1).map((section, index) => (
        <div key={index}>{section}</div>
      ))}
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