import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"

export default function SEO({ title, description, path }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            name
            author {
              name
            }
            title
            description
            siteUrl
          }
        }
      }
    `
  )

  const metaTitle = title || site.siteMetadata.title
  const metaDescription = description || site.siteMetadata.description

  const metas = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: metaTitle,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      property: `twitter:title`,
      content: metaTitle,
    },
    {
      property: `twitter:description`,
      content: metaDescription,
    },
    {
      property: `twitter:creator`,
      content: site.siteMetadata.author.name,
    },
  ]

  let links = [
    {
      rel: `icon`,
      type: `image/x-icon`,
      href: `/favicon.ico`,
    },
  ]
  if (path) {
    links.push({
      href: new URL(path, site.siteMetadata.siteUrl).href,
      rel: `canonical`,
    })
  }

  return (
    <Helmet
      title={title}
      titleTemplate={`${site.siteMetadata.name} | %s`}
      defaultTitle={site.siteMetadata.name}
      meta={metas}
      link={links}
      htmlAttributes={{
        lang: "en",
      }}
    />
  )
}
