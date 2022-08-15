import { Fragment } from 'react';
import GlobalStyle from '../styles/global';

function App({ Component, pageProps }) {
  return (
    <Fragment>
      <GlobalStyle />
      <Component {...pageProps} />
    </Fragment>
  );
}

export default App;
