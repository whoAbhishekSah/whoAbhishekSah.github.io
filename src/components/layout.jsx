import React from 'react';
import { Link } from 'gatsby';
import { rhythm, scale } from '../utils/typography';
import SocialIcons from './header';

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  let header;

  if (location.pathname === rootPath) {
    header = (
      <React.Fragment>
        <SocialIcons />
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              color: 'inherit'
            }}
            to="/"
          >
            {title}
          </Link>
        </h1>
      </React.Fragment>
    );
  } else {
    header = (
      <h3
        style={{
          fontFamily: 'Open Sans',
          marginTop: 0
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            color: 'inherit'
          }}
          to="/"
        >
          {title}
        </Link>
      </h3>
    );
  }
  return (
    <div
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: rhythm(24),
        fontFamily: 'Open Sans',
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
