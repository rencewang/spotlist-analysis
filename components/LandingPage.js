import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCookies } from "cookies-next";
import Footer from "./Footer";
import styles from "../styles/LandingPage.module.css";

const LandingPage = () => {
  const router = useRouter();
  const token = getCookies("token").token;
  const isLoggedIn = !!token;

  const handleLoginClick = () => {
    if (isLoggedIn) {
      router.push("/api/logout");
    } else {
      router.push("/api/login");
    }
  };

  const handleCtaClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/api/login");
    }
  };

  return (
    <div className={styles.wrapper}>
      <header>
        <div>Playlist Anatomy</div>
        <div onClick={handleLoginClick}>
          {isLoggedIn ? "Log Out" : "Log In"}
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.heroTitle}>
          Know
          <br />
          Your Playlists
        </h1>
        <p className={styles.subtitle}>
          Stop guessing. Get raw, unfiltered insights into your Spotify
          playlists.
        </p>

        <button onClick={handleCtaClick} className={styles.ctaButton}>
          {isLoggedIn ? "See your playlists" : "Log in with Spotify"}
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
