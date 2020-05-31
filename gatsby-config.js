/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `jedevc`,
    author: {
      name: `Justin Chadwell`,
    },
    siteUrl: `https://jedevc.com`,
    description: `My personal website and ramblings`,
    social: {
      github: "jedevc",
      twitter: "jedevc",
      linkedin: "jedevc",
      email: "jedevc@gmail.com",
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts/`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
  ],
}
