import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

import { rhythm } from '../utils/typography';

const Introduciton = () => {
  const data = useStaticQuery(graphql`
    query IntroductionQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `);

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      <p>
        Hi, I am Abhishek !
        <br />
        <br />I live in Bangalore and work at
        <a href="https://www.gojek.io/"> Gojek</a> as Product Engineer.
        <br />
        <br />I am passionate about programming, writing, books, ideas and
        knowledge.
        <br />I love to read a lot to gather ideas and thoughts around subjects
        I didn't know about. I am very active on Goodreads, where I track what I
        am reading and what will be my next read.
      </p>
    </div>
  );
};

export default Introduciton;
