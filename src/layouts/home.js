import React from "react"

import Hero from "../components/hero"

export function Layout({ children }) {
  return (
    <>
      <Hero title="Justin Chadwell" subtitle="Personal website" />
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
