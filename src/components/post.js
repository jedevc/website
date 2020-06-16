import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"

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
        <MDXRenderer>{content}</MDXRenderer>
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
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  return date.toLocaleDateString("en-GB", options)
}
