import React, {useState, useEffect} from 'react'
import querystring from 'query-string'

import '../styles/globals.css'

function App() {
  const [token, setToken] = useState(null)
  const client_id = process.env.CLIENT_ID
  const client_secret = process.env.CLIENT_SECRET
  const refresh_token = process.env.REFRESH_TOKEN

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
  const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const REDIRECT = "http://localhost:3000"
  const scopes = [
    "user-top-read",
    "user-read-recently-played",
    "user-read-currently-playing",
    "playlist-read-private",
    "user-library-read"
  ]

  const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token
      })
    })
    
    console.log(response)
    return response.json()
  }

  setToken(await getAccessToken())

  return (
    <main>

      hellooooo

      {!token && (
        <button onClick={() => getAccessToken()}>login</button>
      )}

      {/* {!token && (
        <a className="" 
          href={`${authEndpoint}?client_id=${client_id}&redirect_uri=${REDIRECT}&scope=${scopes.join(
            "%20"
          )}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </a>
      )} */}

      {token && (
        <div>logined</div>
      )}

    </main>
  )
}

export default App
