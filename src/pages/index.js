import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import { Layout, Section } from "../layouts/home"
import Socials from "../components/socials"
import SEO from "../components/seo"

export default function Index() {
  const data = useStaticQuery(graphql`
    query IndexQuery {
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
      markdownRemark(fields: { type: { eq: "data" }, name: { eq: "index" } }) {
        html
      }
    }
  `)

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
      <Section>
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
      </Section>
      {sectionsView.slice(1).map((section, index) => (
        <Section key={index}>{section}</Section>
      ))}
    </Layout>
  )
}
