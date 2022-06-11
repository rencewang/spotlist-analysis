import React, { useState, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react';

// import querystring from 'query-string'
// import axios from 'axios'

import '../styles/globals.css'
// import '../utils/hash'

function App({ Component, pageProps: {session, ...pageProps} }) {
  const [token, setToken] = useState(null)
  const SCOPES = "user-top-read user-read-recently-played user-read-currently-playing playlist-read-private user-library-read"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  // const { CLIENT_ID, REDIRECT_URI } = process.env
  // let access_token, refresh_token, error
  
  // const getHashParams = () => {
  //   var hashParams = {};
  //   var e, r = /([^&;=]+)=?([^&;]*)/g,
  //       q = window.location.hash.substring(1);
  //   while ( e = r.exec(q)) {
  //      hashParams[e[1]] = decodeURIComponent(e[2]);
  //   }
  //   return hashParams;
  // }

  // useEffect(() => {
  //   var params = getHashParams()
  //   if (params) {
  //     setToken(params.access_token);
  //   }
  // }, [])


  // const client_id = process.env.CLIENT_ID
  // const client_secret = process.env.CLIENT_SECRET
  // const refresh_token = process.env.REFRESH_TOKEN

  // const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
  // const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
  // const REDIRECT = "http://localhost:3000/callback"
  // const scopes = [
  //   "user-top-read",
  //   "user-read-recently-played",
  //   "user-read-currently-playing",
  //   "playlist-read-private",
  //   "user-library-read"
  // ]

  // const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  // const AUTH_QUERY_PARAM = querystring.stringify({
  //   client_id: client_id,
  //   response_type: 'code',
  //   redirect_uri: REDIRECT,
  //   scope: scopes,
  // })

  // const getAccessToken = async () => {
  //   const response = await fetch(TOKEN_ENDPOINT, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Basic ${basic}`,
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: querystring.stringify({
  //       grant_type: 'refresh_token',
  //       refresh_token
  //     })
  //   })
    
  //   console.log(response)
  //   return response.json()
  // }

  // setToken(getAccessToken())

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
//     <main>

//       hellooooo

//       {/* {!token && (
//         <button onClick={() => getAccessToken()}>login</button>
//       )} */}

//       {/* {!token && (
//           <a href="/api/login">Login with Spotify</a>
//       )} */}

// {!token && (
//     <a className=""
//       href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=token&show_dialog=true`}
//     >
//       Login to Spotify
//     </a>
//   )}

//       {token && (
//         <div>logined</div>
//       )}

//     </main>
  )
}

export default App
