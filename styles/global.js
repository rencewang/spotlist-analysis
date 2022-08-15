import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    *,
    *:before,
    *:after {
        box-sizing: border-box;
    }

    input:focus,
    select:focus,
    textarea:focus,
    button:focus {
        outline: none;
    }

    ::selection,
    ::-moz-selection {
        background-color: rgb(212, 212, 212);
    }

    ::placeholder {
        color: gray;
    }

    body {
        width: 100vw;
        margin: 0;
        font-size: 18px;
        font-family: -apple-system, BlinkMacSystemFont, 'Arial', 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
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
