import React from "react"
import { Helmet } from "react-helmet"

export default function Favicons() {
  const metas = [
    {
      name: `theme-color`,
      content: `#ffffff`,
    },
    {
      name: `msapplication-TileColor`,
      content: `#da532c`,
    },
  ]

  let links = [
    {
      rel: `manifest`,
      href: `/site.webmanifest`,
    },
    // {
    //   rel: `icon`,
    //   type: `image/x-icon`,
    //   href: `/favicon.ico`,
    // },
    {
      rel: `icon`,
      type: `image/png`,
      sizes: "32x32",
      href: `/favicon-32x32.png`,
    },
    {
      rel: `icon`,
      type: `image/png`,
      sizes: "16x16",
      href: `/favicon-16x16.png`,
    },
    {
      rel: `apple-touch-icon`,
      sizes: "180x180",
      href: `/apple-touch-icon.png`,
    },
    {
      rel: `mask-icon`,
      color: `#5bbad5`,
      href: `/safari-pinned-tab.svg`,
    },
  ]

  return <Helmet meta={metas} link={links} />
}
