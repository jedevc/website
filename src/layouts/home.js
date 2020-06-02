import React from "react"

import Hero from "../components/hero"

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
      <Hero />
      {children}
    </>
  )
}

export function Section({ children }) {
  return (
    <section className="section">
      <div className="container">{children}</div>
    </section>
  )
}
