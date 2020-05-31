import React from "react"

import { Layout, Section } from "../layouts/home"

import Socials from "../components/socials"

export default function Home() {
  return (
    <Layout>
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
              email="jedevc@gmail.com"
              twitter="jedevc"
              linkedin="jedevc"
              github="jedevc"
            />
          </div>
        </div>
      </Section>
    </Layout>
  )
}
