import React from 'react';
import { Link, graphql } from 'gatsby';

import Introduction from '../components/introduction';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';
import { getShortDate, indexPostsByYear } from '../utils/helper';

const renderPost = (node) => {
  const title = node.frontmatter.title || node.fields.slug;
  const dateOfPublication = getShortDate(node.frontmatter.date);
  return (
    <article key={node.fields.slug}>
      <li
        style={{
          marginBottom: rhythm(1 / 4)
        }}
      >
        <span>{dateOfPublication} >> </span>
        <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
          {title}
        </Link>
      </li>
    </article>
  );
};
const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const postsIndexedByYears = indexPostsByYear(data.allMarkdownRemark.edges);
  const years = Object.keys(postsIndexedByYears).sort().reverse();
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Introduction />
      <h3 align="center">Blog posts</h3>
      {years.map((year) => {
        const postsOfThisYear = postsIndexedByYears[year];
        return (
          <React.Fragment>
            <h3>{year}</h3>
            {postsOfThisYear.map(({ node }) => {
              return renderPost(node);
            })}
          </React.Fragment>
        );
      })}
    </Layout>
  );
};

export default BlogIndex;

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
`;
