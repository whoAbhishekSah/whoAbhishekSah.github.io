import React from "react"
import { Link, graphql } from "gatsby"

import Introduction from "../components/introduction"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const getPublishYearOfPost = post =>
  String(new Date(post.node.frontmatter.date).getFullYear())
const indexPostsByYear = posts => {
  console.log("received posts", posts)
  const postsIndexedByYears = {}
  const uniqueYearsSet = new Set()
  posts.map(post => uniqueYearsSet.add(getPublishYearOfPost(post)))
  const uniqueYearsArray = Array.from(uniqueYearsSet)
  uniqueYearsArray.map(i => (postsIndexedByYears[`${i}`] = []))
  posts.map(post => {
    const year = getPublishYearOfPost(post)
    postsIndexedByYears[`${year}`].push(post)
  })
  return postsIndexedByYears
}

const renderPost = node => {
  const title = node.frontmatter.title || node.fields.slug
  return (
    <article key={node.fields.slug}>
      <li
        style={{
          marginBottom: rhythm(1 / 4),
        }}
      >
        <small>{node.frontmatter.date} >> </small>
        <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
          {title}
        </Link>
      </li>
    </article>
  )
}
const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const postsIndexedByYears = indexPostsByYear(data.allMarkdownRemark.edges)
  const years = Object.keys(postsIndexedByYears)
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Introduction />
      <h3 align="center">Blog posts</h3>
      {years.map(year => {
        const postsOfThisYear = postsIndexedByYears[year]

        return postsOfThisYear.map(({ node }) => {
          return renderPost(node)
        })
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
