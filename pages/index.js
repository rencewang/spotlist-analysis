import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { getCookies } from 'cookies-next'

import { getPlaylists } from '../utils/spotify'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  // fill playlists in once when first load
  useEffect(() => {
    const fillPlaylists = async () => {
      const playlists = await getPlaylists()
      setList(playlists)
    }

    // user is logged in if there is a refresh token stored
    (async() => {
      if (getCookies('token').token) {
        await fillPlaylists()
        setLoggedIn(true)
      }
      setIsLoading(false)
    })()
  }, [])

  return (
    <main>
      <Head>
        <title>Spotlist Analysis</title>
        <meta name="description" content="Get Playlist Analysis for Spotify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoading ? <div>loading...</div> : 
      <>
        <header>
          {loggedIn ? <div>welcome</div> : <a href="/api/login">Sign in</a>} 
        </header>

        <section id="playlist-listing">
          {list.map((item) => (
            <div key={item.id}>
              <h1>{item.name}</h1>
            </div>
          ))}
        </section>

        <section id="playlist-analysis">

        </section>
      </>}
    </main>
  )
}
