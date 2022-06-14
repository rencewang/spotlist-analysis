// import React from 'react'
// import { SessionProvider } from 'next-auth/react'

// function App({ Component, pageProps: {session, ...pageProps} }) {

//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   )
// }

// export default App

// import { CookiesProvider } from "react-cookie"
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    // <CookiesProvider>
      <Component {...pageProps} />
    // </CookiesProvider>
  ) 
}

export default MyApp