const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const basePath = process.cwd()

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const { sourceInstanceName, absolutePath } = getNode(node.parent)

    let slug = createFilePath({ node, getNode })
    createNodeField({ node, name: `type`, value: sourceInstanceName })

    if (absolutePath.startsWith(basePath)) {
      const relativePath = absolutePath.slice(basePath.length)
      createNodeField({ node, name: `path`, value: relativePath })
    }

    if (sourceInstanceName == `post`) {
      createNodeField({ node, name: `slug`, value: path.join(`/blog`, slug) })
    } else {
      createNodeField({ node, name: `slug`, value: slug })
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  createPage({
    path: `/blog/`,
    component: path.resolve(`./src/templates/blog-template.js`),
  })

  createPage({
    path: `/portfolio/`,
    component: path.resolve(`./src/templates/portfolio-template.js`),
  })

  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              type
              slug
            }
            frontmatter {
              template
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    let { slug, type } = node.fields

    let template = node.frontmatter.template ? node.frontmatter.template : type
    let component = path.resolve(`./src/templates/${template}-template.js`)

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

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter!
    }
    type Frontmatter {
      title: String
      description: String
      date: String
      hidden: Boolean
    }
  `
  createTypes(typeDefs)
}
