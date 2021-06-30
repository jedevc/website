import React from "react"
import { graphql } from "gatsby"

import Layout from "../layouts/basic"

import { Post } from "../components/post"
import Seo from "../components/seo"
import Dropdown from "../components/dropdown"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

export default function BlogPost({ data }) {
  const { post, prev, next } = data

  const description = post.frontmatter.description || post.excerpt

  return (
    <Layout>
      <Seo
        title={post.frontmatter.title}
        description={description}
        path={post.fields.slug}
      />
      <Dropdown path={post.fields.path} />
      <Post
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        content={post.body}
      />

      <nav className="level">
        <div className="level-left">
          {prev && (
            <a className="level-item button" href={prev.fields.slug}>
              <span className="icon">
                <FaArrowLeft />
              </span>
              <span>Previous post</span>
            </a>
          )}
        </div>
        <div className="level-right">
          {next && (
            <a className="level-item button" href={next.fields.slug}>
              <span>Next post</span>
              <span className="icon">
                <FaArrowRight />
              </span>
            </a>
          )}
        </div>
      </nav>
    </Layout>
  )
}

export const query = graphql`
  query ($slug: String!, $next: String, $prev: String) {
    post: mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt
      frontmatter {
        title
        description
        date
      }
      fields {
        slug
        path
      }
    }
    next: mdx(fields: { slug: { eq: $next } }) {
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
    prev: mdx(fields: { slug: { eq: $prev } }) {
      frontmatter {
        title
      }
      fields {
        slug
      }
    }
  }
`
