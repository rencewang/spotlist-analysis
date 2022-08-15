import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    *,
    *:before,
    *:after {
        box-sizing: border-box;
        /* color: ${({ theme }) => theme.textColor}; */
    }

    input:focus,
    select:focus,
    textarea:focus,
    button:focus {
        outline: none;
    }

    ::placeholder {
        /* color: ${({ theme }) => theme.subTextColor};; */
    }

    body {
        width: 100vw;
        margin: 0;
        font-size: 18px;
        font-family: -apple-system, BlinkMacSystemFont, 'Arial', 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* background: ${({ theme }) => theme.backgroundColor}; */
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
        margin: 5px 0;
    }

    ::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }
`;

export default GlobalStyle;
