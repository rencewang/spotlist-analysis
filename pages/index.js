import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCookies } from 'cookies-next';
import LandingPage from '../components/LandingPage';

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check login status
    const token = getCookies('token').token;
    if (token) {
        setLoggedIn(true);
        // Redirect to dashboard if logged in
        router.push('/dashboard');
    } else {
        setLoggedIn(false);
    }
  }, [router]);

  if (loggedIn === null) return null; // Loading state

  return (
    <>
      <Head>
        <title>Know Your Playlist</title>
        <meta name="description" content="Objective Analysis for Spotify Playlists" />
      </Head>
      <LandingPage />
    </>
  );
};

export default Home;

