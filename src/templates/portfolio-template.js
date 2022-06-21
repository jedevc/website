import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { FaLink } from "react-icons/fa"

import Layout from "../layouts/basic"
import Seo from "../components/seo"
import Favicons from "../components/favicons"

export default function Portfolio({ data }) {
  const sections = data.allPortfolioYaml.nodes

  return (
    <Layout>
      <Favicons />
      <Seo title="Portfolio" path="/portfolio/" />

      <h1 className="title">My Portfolio</h1>

      {sections.map((section, index) => (
        <PortfolioSection key={index} {...section} />
      ))}
    </Layout>
  )
}

function PortfolioSection({ title, items }) {
  return (
    <>
      <h2 className="title is-4">{title}</h2>

      <div className="custom-grid">
        {items.map((item, index) => (
          <div key={index} className="custom-grid-item">
            <PortfolioItem {...item} />
          </div>
        ))}
      </div>
      <br />
    </>
  )
}

function PortfolioItem({ name, subname, link, image, text, points }) {
  const cardImage = getImage(image)

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
            <GatsbyImage image={cardImage} alt="" />
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
              gatsbyImageData(width: 650, placeholder: BLURRED)
            }
          }
        }
      }
    }
  }
`
