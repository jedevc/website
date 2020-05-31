import React from "react"
import { graphql, useStaticQuery } from "gatsby"

import { Layout, Section } from "../layouts/home"
import Socials from "../components/socials"
import SEO from "../components/seo"

export default function Home() {
  const data = useStaticQuery(graphql`
    query IndexSocialQuery {
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
  `)
  const { github, twitter, linkedin, email } = data.site.siteMetadata.social

  return (
    <Layout>
      <SEO path="/" />
      <Section>
        <div className="columns">
          <div className="column content">
            <h1 className="title is-family-monospace">whoami</h1>
            <p>
              Hey there, I'm Justin! I also go as @jedevc in online places, a
              random collection of letters which you can pronounce however you
              like, I don't really mind.
            </p>
            <p>
              I'm a university student, developer, occasional web designer, and
              security enthusiast!
            </p>
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
      </Section>
    </Layout>
  )
}
