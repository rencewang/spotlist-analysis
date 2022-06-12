import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'

import styles from '../styles/Home.module.css'

export default function Home() {
  const {data: session} = useSession()
  const [list, setList] = useState([])

  const getPlaylists = async () => {
    const res = await fetch('/api/playlists')
    const { playlists } = await res.json()
    setList(playlists)
    console.log(playlists)
  }

  useEffect(() => {
    getPlaylists()
  }, [])

  if (session) {
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
          Signed in as {session?.token?.email} <br />
          <button onClick={() => signOut('spotify')}>Sign out</button>
        </div>
      </main>
    );
  }
  return (
    <main>
      <Head>
        <title>Spotlist Analysis</title>
        <meta name="description" content="Get Playlist Analysis for Spotify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </main>
  );
}
