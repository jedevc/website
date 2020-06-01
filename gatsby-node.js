const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const { sourceInstanceName, name, relativePath } = getNode(node.parent)

    let slug
    switch (sourceInstanceName) {
      case `pages`:
        slug = createFilePath({ node, getNode })
        createNodeField({ node, name: `type`, value: `page` })
        createNodeField({ node, name: `slug`, value: slug })
        createNodeField({ node, name: `path`, value: path.join(`/src/pages`, relativePath) })
        break
      case `posts`:
        slug = createFilePath({ node, getNode, basePath: `posts/` })
        createNodeField({ node, name: `type`, value: `post` })
        createNodeField({ node, name: `slug`, value: path.join(`/blog`, slug) })
        createNodeField({ node, name: `path`, value: path.join(`/src/posts`, relativePath) })
        break
      case `data`:
        createNodeField({ node, name: `type`, value: `data` })
        createNodeField({ node, name: `name`, value: name })
        break
      default:
        return
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
      default:
        return
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
      title: String!
      display: String!
      description: String!
      siteUrl: String!
      author: SiteMetadataAuthor!
      social: SiteMetadataSocial!
      github: String
    }
    type SiteMetadataAuthor {
      name: String!
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
