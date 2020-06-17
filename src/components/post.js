import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"

import MDXProvider from "../mdx"

export function PostPreview({ title, date, summary }) {
  return (
    <div className="box mb-4">
      <PostHeader title={title} date={date} />
      <p>{summary}</p>
    </div>
  )
}

export function Post({ title, date, content }) {
  return (
    <>
      <PostHeader title={title} date={date} />
      <div className="content">
        <MDXProvider>
          <MDXRenderer>{content}</MDXRenderer>
        </MDXProvider>
      </div>
    </>
  )
}

function PostHeader({ title, date }) {
  return (
    <>
      {title && <h1 className="title mb-2">{title}</h1>}
      {date && (
        <div className="has-text-grey is-size-7 mb-5">
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
      )}
    </>
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
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}
