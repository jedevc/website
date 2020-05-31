import React from "react"

export function PostPreview({ title, date, summary }) {
  return (
    <div className="box" style={{ marginBottom: "1rem" }}>
      <PostHeader title={title} date={date} />
      <p>{summary}</p>
    </div>
  )
}

export function Post({ title, date, content }) {
  return (
    <>
      <PostHeader title={title} date={date} />
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </>
  )
}

function PostHeader({ title, date }) {
  return (
    <>
      <h2 className="title" style={{ marginBottom: "0.6rem" }}>
        {title}
      </h2>
      <div
        className="has-text-grey is-size-7"
        style={{ marginBottom: "1.2rem" }}
      >
        <time dateTime={date}>{formatDate(date)}</time>
      </div>
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
