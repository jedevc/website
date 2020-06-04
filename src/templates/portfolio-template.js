import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import { FaLink } from "react-icons/fa"

import Layout from "../layouts/basic"
import SEO from "../components/seo"

export default function Portfolio({ data }) {
  const sections = data.allPortfolioYaml.nodes

  return (
    <Layout>
      <SEO title="Portfolio" path="/portfolio" />
      {sections.map((section, index) => (
        <PortfolioSection key={index} {...section} />
      ))}
    </Layout>
  )
}

function PortfolioSection({ title, items }) {
  return (
    <>
      <h1 className="title">{title}</h1>

      <div className="grid">
        {items.map((item, index) => (
          <div key={index} className="grid-item">
            <PortfolioItem {...item} />
          </div>
        ))}
      </div>
      <br />
    </>
  )
}

function PortfolioItem({ name, subname, link, image, text, points }) {
  return (
    <div className="card">
      <div className="card-header">
        <p className="card-header-title">{name}</p>
        {link && (
          <a href={link} className="card-header-icon has-text-grey">
            <span className="icon">
              <FaLink />
            </span>
          </a>
        )}
      </div>
      {image && (
        <div className="card-image">
          <figure className="image">
            <Img fluid={image.childImageSharp.fluid} />
          </figure>
        </div>
      )}
      <div className="card-content">
        {subname && <h3 className="subtitle">{subname}</h3>}
        {text && <p>{text}</p>}
        {points && (
          <ul className="content">
            {points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export const query = graphql`
  query {
    allPortfolioYaml {
      nodes {
        title
        items {
          name
          subname
          link
          text
          points
          image {
            childImageSharp {
              fluid(maxWidth: 650, maxHeight: 325) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
