import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getCookies } from 'cookies-next'


import { getPlaylists, getTracks } from '../utils/spotify'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [list, setList] = useState([])
  const [tracks, setTracks] = useState([])


  const fillPlaylists = async () => {
    const playlists_response = await getPlaylists()
    setList(playlists_response)
  }

  const fillTracks = async (url) => {
    const tracks_response = await getTracks(url)
    setTracks(tracks_response)
  }

  // fill playlists in once when first load
  useEffect(() => {
    // user is logged in if there is a refresh token stored
    (async () => {
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
          {loggedIn ? <div>welcome</div> : <Link href="/api/login">Sign in</Link>} 
        </header>

        <section id="playlist-listing">
          {list.map((item) => (
            <div key={item.id}>
              <button onClick={() => fillTracks(item.tracks.href)}>{item.name}</button>
            </div>
          ))}
        </section>

        <section id="playlist-analysis">
          {tracks.map((item) => (
            <div key={item.track.id}>
              <div>{item.track.name}</div>
            </div>
          ))}
        </section>
      </>}
    </main>
  )
}
