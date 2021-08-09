import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

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
        <br />I am passionate about programming, writing and knowledge.
        <br />
        This zone is an attempt to outline my journey in tech and other
        veriticals of my interest, right from the beginning. Hit me up on my
        socials to connect !
      </p>
    </div>
  );
};

export default Introduciton;
