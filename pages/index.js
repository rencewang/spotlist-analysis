import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import { getCookies } from 'cookies-next'

import styles from '../styles/Home.module.css'

export default function Home() {
  const [list, setList] = useState([])

  const getPlaylists = async () => {
    let playlists = []
    try {
      const token_response = await axios.get('/api/token')
      // console.log(access_token)
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token_response.data}`,
        }
      })
      let { items, next } = await response.json()
      playlists.push(...items)

      while (next) {
        const nextPage = await fetch(next, {
          headers: {
            Authorization: `Bearer ${token_response.data}`,
          }
        })
        const nextPageData = await nextPage.json()

        items = nextPageData.items
        next = nextPageData.next
        playlists.push(...items)
      }
    } catch (error) {
      console.log(error)
    }
    console.log(playlists)
    return playlists
  }

  const fillPlaylists = async () => {
    const playlists = await getPlaylists()
    setList(playlists)
  }

  useEffect(() => {
    console.log(getCookies('token').token)
    if (getCookies('token').token) {
      fillPlaylists()
    }
  }, [])

  if (list.length > 0) {
    return (
      <main>
        <Head>
          <title>Spotlist Analysis</title>
          <meta name="description" content="Get Playlist Analysis for Spotify" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {list.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
          </div>
        ))}
        
        <div>
          {/* Signed in as {session?.token?.email} <br /> */}
          {/* <button onClick={() => signOut('spotify')}>Sign out</button> */}
          hi
        </div>
      </main>
    )
  }

  return (
    <main>
      <Head>
        <title>Spotlist Analysis</title>
        <meta name="description" content="Get Playlist Analysis for Spotify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      Not signed in <br />
      <a href="/api/login">Sign in</a>
    </main>
  )
}
