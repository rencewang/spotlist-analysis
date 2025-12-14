import { Fragment } from 'react';
import { ThemeProvider } from 'styled-components';
import { SWRConfig } from 'swr';

import GlobalStyle from '../styles/global';
import { theme } from '../styles/theme';

function App({ Component, pageProps }) {
  return (
    <Fragment>
      <SWRConfig value={{ revalidateOnFocus: false, dedupingInterval: 60000 }}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </SWRConfig>
    </Fragment>
  );
}

export default App;
