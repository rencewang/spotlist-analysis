import { Fragment } from 'react';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from '../styles/global';
import { theme } from '../styles/theme';

function App({ Component, pageProps }) {
  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </Fragment>
  );
}

export default App;
