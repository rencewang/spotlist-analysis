import Head from 'next/head'

import App from './_app'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spotlist Analysis</title>
        <meta name="description" content="Get Playlist Analysis for Spotify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <App />
    </div>
  )
}
