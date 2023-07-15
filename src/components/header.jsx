import React from 'react';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import './style.css';

const iconStyle = {
  color: 'black',
  textDecoration: 'none',
  margin: '10px',
  boxShadow: 'none'
};

const italic = {
  fontStyle: 'italic',
  textDecoration: 'none'
};

const SocialIcons = () => {
  return (
    <React.Fragment>
      <div style={{ textAlign: 'right' }}>
        <a
          href={require('../../Abhishek_Sah_resume.pdf')}
          style={italic}
          target="_blank"
        >
          Resume
        </a>
        <a href="https://twitter.com/whoAbhishekSah" style={iconStyle}>
          <FaTwitter />
        </a>
        <a href="https://github.com/whoAbhishekSah/" style={iconStyle}>
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/whoabhisheksah/" style={iconStyle}>
          <FaLinkedin />
        </a>
      </div>
      {/* <span className="fading_line" /> */}
    </React.Fragment>
  );
};

export default SocialIcons;
