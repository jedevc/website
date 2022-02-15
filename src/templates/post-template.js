import React from "react"
import { graphql, Link } from "gatsby"

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

      <PostActionButtons>
        <PostActionButton
          link={prev && prev.fields.slug}
          icon={<FaArrowLeft />}
          text="Previous post"
        />
        <PostActionButton
          link={next && next.fields.slug}
          icon={<FaArrowRight />}
          text="Next post"
        />
      </PostActionButtons>
    </Layout>
  )
}

function PostActionButtons({ children }) {
  return <div className="columns is-gapless mt-4">{children}</div>
}

function PostActionButton({ link, text, icon }) {
  return (
    <div className="column mx-2 my-2">
      {link && (
        <Link className="button is-fullwidth" to={link}>
          <span className="icon">{icon}</span>
          <span>{text}</span>
        </Link>
      )}
    </div>
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
