import React from "react";
import Link from "next/link";
import styles from "../styles/LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <div className={styles.logo}>PLAYLIST SIGNALS</div>
        <div>LOG IN</div>
      </nav>

      <main className={styles.main}>
        <h1 className={styles.heroTitle}>
          OBJECTIVE
          <br />
          ANALYSIS
        </h1>
        <p className={styles.subtitle}>
          Stop guessing. Get raw, unfiltered insights into your Spotify
          playlists.
        </p>

        <Link href="/api/login" className={styles.ctaButton}>
          Log in with Spotify
        </Link>
      </main>
    </div>
  );
};

export default LandingPage;
