import React from "react";
import { useRouter } from "next/router";
import Footer from "../components/Footer";
import styles from "../styles/Legal.module.css";

export default function Terms() {
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
        <h1>Terms of Service</h1>
        <p className={styles.updated}>Last updated: December 21, 2025</p>

        <section>
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            Playlist Anatomy (the "Service"). Please read them carefully. By
            connecting your Spotify account to the Service, you agree to be
            bound by these Terms.
          </p>

          <p>
            Playlist Anatomy is a web-based visualization tool that provides
            analytics and statistical insights into your Spotify music library
            using the Spotify Web API. The Service is for personal,
            non-commercial use only. Playlist Anatomy is an independent
            application and is not a part of, or endorsed by, Spotify AB.
          </p>
        </section>

        <section>
          <h2>1. Eligibility</h2>
          <p>
            <strong>Eligibility:</strong> You must have a valid Spotify account
            to use the Service.
          </p>
          <p>
            <strong>Authentication:</strong> Access is granted via Spotify's
            OAuth authentication. We do not see, collect, or store your Spotify
            password.
          </p>
          <p>
            <strong>Scope of Access:</strong> The Service requests "read-only"
            access to your library. We will not modify your account or content
            on your behalf.
          </p>
        </section>

        <section>
          <h2>2. User Conduct and Restrictions</h2>
          <p>
            You agree to use the Service only for its intended purpose. You are
            expressly prohibited from:
          </p>
          <ul>
            <li>
              <strong>Reverse Engineering:</strong> Decompiling,
              reverse-engineering, disassembling, or otherwise attempting to
              derive the source code of the Service or the Spotify Platform.
            </li>
            <li>
              <strong>Data Misuse:</strong> Using any robot, spider, or
              automated tool to retrieve or index any portion of the Spotify
              Content provided through the Service.
            </li>
            <li>
              <strong>Harmful Content:</strong> Using the Service in any way
              that promotes illegal activity, violence, political candidates, or
              religious causes.
            </li>
            <li>
              <strong>AI Training:</strong> Using the Service or any data
              provided therein to train machine learning or artificial
              intelligence models.
            </li>
            <li>
              <strong>Circumvention:</strong> Attempting to bypass any security
              measures or geographical restrictions employed by the Service or
              Spotify.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Data Privacy and Retention</h2>
          <p>
            Your data is processed in real-time. We do not store your Spotify
            Personal Data on our servers once your active session ends or the
            browser tab is closed.
          </p>
          <p>
            <strong>Privacy Policy:</strong> Our data practices are further
            detailed in our <a href="/privacy">Privacy Policy</a>.
          </p>
          <p>
            <strong>Third-Party Terms:</strong> Your use of the Service is also
            subject to{" "}
            <a
              href="https://www.spotify.com/legal/end-user-agreement/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify's Terms of Service
            </a>
            .
          </p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            <strong>Service Ownership:</strong> All software, design, and
            graphics within the Service are the property of Playlist Anatomy.
          </p>
          <p>
            <strong>Spotify Content:</strong> All metadata, album art, and
            artist information are the property of Spotify or its licensors. You
            do not acquire any ownership rights to Spotify Content by using this
            Service.
          </p>
        </section>

        <section>
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO
            THE MAXIMUM EXTENT PERMITTED BY LAW, PLAYLIST ANATOMY AND SPOTIFY
            EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
          <p>
            NEITHER PLAYLIST ANATOMY NOR SPOTIFY WARRANT THAT: THE SERVICE WILL
            MEET YOUR REQUIREMENTS; THE SERVICE WILL BE UNINTERRUPTED, TIMELY,
            SECURE, OR ERROR-FREE; THE RESULTS OBTAINED FROM THE USE OF THE
            SERVICE WILL BE ACCURATE OR RELIABLE.
          </p>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
            PLAYLIST ANATOMY, ITS DEVELOPERS, OR SPOTIFY BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN
            CONNECTION WITH THE SERVICE.
          </p>
        </section>

        <section>
          <h2>8. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Playlist Anatomy and its
            developers from any claim or demand, including reasonable attorney
            fees, made by any third party due to or arising out of your
            violation of these Terms or your violation of any law or the rights
            of a third party.
          </p>
        </section>

        <section>
          <h2>9. Spotify as a Third-Party Beneficiary</h2>
          <p>
            You acknowledge and agree that Spotify is a third-party beneficiary
            of these Terms of Service and the associated Privacy Policy. As
            such, Spotify is entitled to directly enforce these Terms against
            you to protect its interests in the Spotify Platform and Spotify
            Content.
          </p>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the United States, without regard to its conflict of law
            provisions.
          </p>
        </section>

        <section>
          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Any changes
            will be effective immediately upon posting the revised Terms on this
            page. Your continued use of the Service following such changes
            constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us via
            email: anatomy@rence.la.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
