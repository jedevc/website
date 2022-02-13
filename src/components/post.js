import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import MDXProvider from "../mdx"

export function PostPreview({
  title,
  date,
  summary,
  small = false,
  className = "",
  ...props
}) {
  return (
    <div className={`box ${className}`} {...props}>
      <PostHeader title={title} date={date} small={small} />
      <p className={small ? "is-size-7" : "is-size-6"}>{summary}</p>
    </div>
  )
}

export function Post({ title, date, content, ...props }) {
  return (
    <div {...props}>
      <PostHeader title={title} date={date} />
      <div className="content">
        <MDXProvider>
          <MDXRenderer>{content}</MDXRenderer>
        </MDXProvider>
      </div>
    </div>
  )
}

function PostHeader({ title, date, small = false, ...props }) {
  return (
    <div {...props}>
      {title && <h2 className={`title mb-2 is-${small ? 4 : 3}`}>{title}</h2>}
      {date && (
        <div className={`has-text-grey mb-5 is-size-7`}>
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
      )}
    </div>
  )
}

function formatDate(dateString) {
  const date = new Date(dateString)

  // https://github.com/nodejs/node/issues/8500
  // toLocaleDateString does not work prior to Node 13, and so doesn't work as
  // intended on Netlify. So, instead of doing the real modern way, we can hack
  // it manually.

  // const options = {
  //   day: "numeric",
  //   month: "long",
  //   year: "numeric",
  // }
  // return date.toLocaleDateString("en-GB", options)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}
