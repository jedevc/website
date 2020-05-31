/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    name: `jedevc`,
    siteUrl: `https://jedevc.com`,
    title: `Justin Chadwell`,
    description: `My personal website and ramblings`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `Post`,
        path: `${__dirname}/src/posts/`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-sass`,
  ],
}
