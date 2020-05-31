import React from "react"

import Nav from "../components/nav"

export function Layout({ children }) {
  return (
    <>
      <Nav />

      {children}
    </>
  )
}

export function Section({ children }) {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-three-quarters-desktop is-three-quarters-tablet is-full-mobile">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
