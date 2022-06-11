import React, { useState } from 'react'
import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'

import styles from '../styles/Home.module.css'

export default function Home() {
  const {data: session} = useSession()
  const [list, setList] = useState([])

  const getPlaylists = async () => {
    const res = await fetch('/api/playlists')
    const { items } = await res.json()
    setList(items)
  }

  if (session) {
    return (
      <main>
        <Head>
          <title>Spotlist Analysis</title>
          <meta name="description" content="Get Playlist Analysis for Spotify" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <button onClick={() => getPlaylists()}>Get all playlists</button>
        {list.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <img src={item.images[0]?.url} width="100" />
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
      <button onClick={() => signIn('spotify')}>Sign in</button>
    </main>
  );
}
