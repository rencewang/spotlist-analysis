import React, { useEffect, useState } from 'react'
import Head from 'next/head'
// import { useSession, signIn, signOut } from 'next-auth/react'
import { getCookies, setCookies, removeCookies } from 'cookies-next';

import getAccessToken from '../utils/spotify'
import styles from '../styles/Home.module.css'

export default function Home() {
  // const {data: session} = useSession()
  const [list, setList] = useState([])

  const getPlaylists = async (refresh_token) => {
    try {
      const access_token = await getAccessToken(refresh_token)
      console.log(access_token)
      
      const response = await fetchByURL(access_token, 'https://api.spotify.com/v1/me/playlists')
      let { items, next } = await response.json()
      setList(list => [...list, ...items])

      while (next) {
        const nextPage = await fetchByURL(access_token, next)
        const nextPageData = await nextPage.json()

        items = nextPageData.items
        next = nextPageData.next
        setList(list => [...list, ...items])
      }

    } catch (error) {
      console.log(error)
      return error
    }

  }

  // const getPlaylists = async () => {
  //   const res = await fetch('/api/playlists')
  //   const { playlists } = await res.json()
  //   setList(playlists)
  //   console.log(playlists)
  // }

  useEffect(() => {
    // getPlaylists()
    if (getCookies('token').token) {
      getPlaylists(getCookies('token').token)
    }
    console.log(getCookies('token'))
    console.log(getCookies('token').token)
    console.log(list)
  }, [])

  if (list.length) {
    return (
      <main>
        <Head>
          <title>Spotlist Analysis</title>
          <meta name="description" content="Get Playlist Analysis for Spotify" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* {list.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
          </div>
        ))} */}
        
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
      {/* <button onClick={() => signIn('spotify')}>Sign in</button> */}
      <a href="/api/login">Sign in</a>
    </main>
  )
}
