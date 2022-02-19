const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const basePath = process.cwd()

exports.onCreateNode = async ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `Mdx`) {
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

  return node
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Blog listing
  createPage({
    path: `/blog/`,
    component: path.resolve(`./src/templates/blog-template.js`),
  })

  // Portfolio
  createPage({
    path: `/portfolio/`,
    component: path.resolve(`./src/templates/portfolio-template.js`),
  })

  // Post pages
  const posts = (
    await graphql(`
      query {
        allMdx(
          filter: { fields: { type: { eq: "post" } } }
          sort: { fields: [frontmatter___date], order: ASC }
        ) {
          nodes {
            fields {
              type
              slug
            }
            frontmatter {
              template
              hidden
            }
          }
        }
      }
    `)
  ).data.allMdx.nodes
  posts.forEach((node, index) => {
    let { slug, type } = node.fields

    let template = node.frontmatter.template ? node.frontmatter.template : type
    let component = path.resolve(`./src/templates/${template}-template.js`)

    let nextPost
    let prevPost
    if (!node.frontmatter.hidden) {
      if (index > 0) {
        for (let i = index - 1; i >= 0; i--) {
          if (!posts[i].frontmatter.hidden) {
            prevPost = posts[i].fields.slug
            break
          }
        }
      }
      if (index < posts.length - 1) {
        for (let i = index + 1; i < posts.length; i++) {
          if (!posts[i].frontmatter.hidden) {
            nextPost = posts[i].fields.slug
            break
          }
        }
      }
    }

    createPage({
      path: slug,
      component: component,
      context: {
        slug: slug,
        next: nextPost,
        prev: prevPost,
      },
    })
  })

  // Non-post pages
  const others = (
    await graphql(`
      query {
        allMdx(filter: { fields: { type: { ne: "post" } } }) {
          nodes {
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
    `)
  ).data.allMdx.nodes
  others.forEach(node => {
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

exports.createSchemaCustomization = ({ actions, createContentDigest }) => {
  const { createFieldExtension, createTypes } = actions

  createFieldExtension({
    name: "mdx",
    extend() {
      return {
        type: "String",
        resolve(source, args, context, info) {
          const value = source[info.fieldName]
          const mdxType = info.schema.getType("Mdx")
          const { resolve } = mdxType.getFields().body

          return resolve(
            {
              rawBody: value,
              internal: {
                contentDigest: createContentDigest(value),
              },
            },
            args,
            context,
            info
          )
        },
      }
    },
  })

  createTypes(`
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

    type Mdx implements Node {
      frontmatter: Frontmatter!
    }
    type Frontmatter {
      title: String
      description: String
      date: String
      template: String
      hidden: Boolean
      sections: [Section]
    }
    type Section {
      content: String @mdx
    }
  `)
}
