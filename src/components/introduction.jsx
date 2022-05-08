import React from 'react';
import { FaGithub } from 'react-icons/fa';

import { useStaticQuery, graphql } from 'gatsby';

const iconStyle = {
  textDecoration: 'underline',
  margin: '5px',
  boxShadow: 'none'
};

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
        <a href="https://instabase.com"> Instabase</a> as Production Engineer
        and love to contribute in Open source.
        <br />
        <br />
        Previously I've worked at{' '}
        <a href="https://github.com/odpf"> Gojek Data Platform</a> team building
        alert orchestration and managing data infrastructure.
        <br />
        <br />I am passionate about programming, writing and knowledge. Most of
        my work is on
        <a href="https://github.com/whoAbhishekSah/" style={iconStyle}>
          Github <FaGithub />
        </a>
        .
        <br />
        <br />I mostly write blogs on my technical learnings and interesting
        stories from workplace. If you're a tech recruiter, you might be
        interested in my{' '}
        <a
          href={require('../../Abhishek_Sah_resume.pdf')}
          style={{
            fontStyle: 'italic'
          }}
          target="_blank"
        >
          resume
        </a>{' '}
        😄.
        <br />
      </p>
    </div>
  );
};

export default Introduciton;
