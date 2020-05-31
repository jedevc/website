import React from "react"
import { Link } from "gatsby"

import { Layout, Section } from "../layouts/basic"
import SEO from "../components/seo"

export default function NotFound() {
  return (
    <Layout>
      <SEO title="Page not found" />
      <Section>
        <h1 className="title">Page not found</h1>
        <p>The page you are looking for has been removed or relocated.</p>
        <p>
          <Link to="/">Go back</Link>
        </p>
      </Section>
    </Layout>
  )
}
