import React from 'react';
import { FaTwitter, FaGithub, FaGoodreads, FaLinkedin } from 'react-icons/fa';
import './style.css';

const iconStyle = {
  color: 'black',
  textDecoration: 'none',
  margin: '10px',
  boxShadow: 'none'
};

const SocialIcons = () => {
  return (
    <React.Fragment>
      <div style={{ textAlign: 'right' }}>
        <a href="https://twitter.com/whoAbhishekSah" style={iconStyle}>
          <FaTwitter />
        </a>
        <a
          href="https://www.goodreads.com/user/show/74087763-abhishek-sah/"
          style={iconStyle}
        >
          <FaGoodreads />
        </a>
        <a href="https://github.com/whoAbhishekSah/" style={iconStyle}>
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/abhishek-sah-1169a5109/"
          style={iconStyle}
        >
          <FaLinkedin />
        </a>
      </div>
      <span className="fading_line" />
    </React.Fragment>
  );
};

export default SocialIcons;
