const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `posts/` })
    const { sourceInstanceName } = getNode(node.parent)

    switch (sourceInstanceName) {
      case `pages`:
        createNodeField({ node, name: `type`, value: `page` })
        createNodeField({ node, name: `slug`, value: slug })
        break
      case `posts`:
        createNodeField({ node, name: `type`, value: `post` })
        createNodeField({ node, name: `slug`, value: path.join(`/blog`, slug) })
        break
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              type
              slug
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    let component
    switch (node.fields.type) {
      case "page":
        component = path.resolve(`./src/templates/page.js`)
        break
      case "post":
        component = path.resolve(`./src/templates/post.js`)
        break
    }

    createPage({
      path: node.fields.slug,
      component: component,
      context: {
        slug: node.fields.slug,
      },
    })
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Site implements Node {
      siteMetadata: SiteMetadata!
    }
    type SiteMetadata {
      name: String!
      siteUrl: String!
      title: String!
      description: String!
      social: SiteMetadataSocial!
    }
    type SiteMetadataSocial {
      github: String
      twitter: String
      linkedin: String
      email: String
    }
  `
  createTypes(typeDefs)
}
