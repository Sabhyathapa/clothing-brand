import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #ffffff;
    color: #000000;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 900;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .home-image {
    width: 460px;
    height: 540px;
    object-fit: cover;
    border-radius: 1.2rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
    cursor: pointer;
  }
  .home-image:hover {
    transform: scale(1.01) translateY(-8px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.28);
  }
`;

export default GlobalStyles; 