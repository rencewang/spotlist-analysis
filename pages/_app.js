import { SWRConfig } from 'swr';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, dedupingInterval: 60000 }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default App;
