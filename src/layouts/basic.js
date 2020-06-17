import React from "react"

import Nav from "../components/nav"

export default function Full({ children }) {
  return (
    <Layout>
      <Section>{children}</Section>
    </Layout>
  )
}

export function Layout({ children }) {
  return (
    <>
      <Nav sticky={true} />

      {children}
    </>
  )
}

export function Section({ children }) {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds-desktop is-full-tablet">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
