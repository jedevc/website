const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `posts/` })
    const { sourceInstanceName } = getNode(node.parent)

    createNodeField({
      node,
      name: `slug`,
      value: path.join("/blog", slug),
    })
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
              slug
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/post.js`),
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