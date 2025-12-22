import React from "react";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import styles from "../styles/Legal.module.css";

export default function Privacy() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <header>
        <div onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
          Playlist Anatomy
        </div>
        <div></div>
      </header>

      <main className={styles.main}>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: December 21, 2025</p>

        <section>
          <p>
            Playlist Anatomy is a web-based visualization tool that provides
            analytics and statistical insights into your Spotify music library
            using the Spotify Web API. The Service is for personal,
            non-commercial use only. Playlist Anatomy is an independent
            application and is not a part of, or endorsed by, Spotify AB.
          </p>
        </section>

        <section>
          <h2>Data Collection</h2>
          <p>We collect the following data when you use our service:</p>
          <ul>
            <li>
              Spotify profile information (username, email, profile image)
            </li>
            <li>Playlist data (tracks, artists, albums, metadata)</li>
            <li>Authentication tokens stored in browser cookies</li>
          </ul>
        </section>

        <section>
          <h2>Data Usage</h2>
          <p>Your data is used solely to:</p>
          <ul>
            <li>Display playlist analytics and visualizations</li>
            <li>Authenticate your Spotify account</li>
            <li>Maintain your session</li>
          </ul>
          <p>We do not sell, share, or transfer your data to third parties.</p>
        </section>

        <section>
          <h2>Data Storage</h2>
          <p>
            Authentication tokens are stored in browser cookies and expire after
            your session ends. Playlist data is processed in real-time and not
            permanently stored on our servers.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            This service uses the Spotify Web API. Your use of Spotify data is
            subject to{" "}
            <a
              href="https://www.spotify.com/legal/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify's Privacy Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You may:</p>
          <ul>
            <li>
              Revoke access at any time through your Spotify account settings
            </li>
            <li>Clear cookies to remove authentication data</li>
            <li>Request data deletion by logging out</li>
          </ul>
        </section>

        <section>
          <h2>International Data Transfers</h2>
          <p>
            When you use our Service, your data is processed on servers located
            in the United States. If you are a resident of a jurisdiction where
            the transferring of your Personal Data requires your consent, then
            your consent to this Privacy Policy includes your express consent
            for such data transfer.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>For privacy concerns, contact us via anatomy@rence.la .</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
