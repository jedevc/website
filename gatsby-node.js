const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const { sourceInstanceName, relativePath } = getNode(node.parent)

    let slug = createFilePath({ node, getNode })
    createNodeField({ node, name: `type`, value: sourceInstanceName })
    createNodeField({
      node,
      name: `path`,
      value: path.join(`/content/${sourceInstanceName}`, relativePath),
    })

    if (sourceInstanceName == `posts`) {
      createNodeField({ node, name: `slug`, value: path.join(`blog`, slug) })
    } else {
      createNodeField({ node, name: `slug`, value: slug })
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  createPage({
    path: '/blog',
    component: path.resolve('./src/templates/blog-template.js')
  });

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
    let { slug, type } = node.fields

    let component
    switch (type) {
      case "pages":
        if (slug == "/") {
          component = path.resolve(`./src/templates/index-template.js`)
        } else {
          component = path.resolve(`./src/templates/page-template.js`)
        }
        break
      case "posts":
        component = path.resolve(`./src/templates/post-template.js`)
        break
      default:
        return
    }

    createPage({
      path: slug,
      component: component,
      context: {
        slug: slug,
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
