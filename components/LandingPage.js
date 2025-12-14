import React from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const Wrapper = styled.div`
  background: #f0f0f0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #000;
  overflow: hidden;
`;

const Nav = styled.nav`
  padding: 1rem 2rem;
  border-bottom: 2px solid #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  z-index: 10;
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: -1px;
`;

const Marquee = styled.div`
  background: #000;
  color: #fff;
  padding: 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  position: relative;

  div.track {
    display: inline-block;
    animation: ${scroll} 20s linear infinite;
    font-family: "Menlo", monospace;
    font-size: 0.8rem;
  }

  span {
    margin-right: 2rem;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    bottom: 0;
    width: 1px;
    background: #ccc;
    z-index: 0;
  }
`;

const HeroTitle = styled.h1`
  font-size: 8vw;
  line-height: 0.9;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0 0 2rem;
  z-index: 1;
  background: #f0f0f0;
  padding: 0 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  max-width: 600px;
  margin: 0 auto 3rem;
  font-weight: 500;
  z-index: 1;
  background: #f0f0f0;
  padding: 0.5rem;
`;

const CtaButton = styled.a`
  background: #ff3b30;
  color: #fff;
  text-decoration: none;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
  transition: transform 0.2s, background 0.2s;
  z-index: 1;
  cursor: pointer;

  &:hover {
    background: #000;
    transform: scale(1.05);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 2px solid #000;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureBox = styled.div`
  padding: 2rem;
  border-right: 1px solid #ccc;
  background: #fff;

  h3 {
    font-size: 0.9rem;
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 1rem;
    border-bottom: 2px solid #000;
    display: inline-block;
  }

  p {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #333;
  }

  &:last-child {
    border-right: none;
  }
`;

const LandingPage = () => {
  return (
    <Wrapper>
      <Nav>
        <Logo>PLAYLIST SIGNALS</Logo>
        <div>LOG IN</div>
      </Nav>

      <Main>
        <HeroTitle>
          OBJECTIVE
          <br />
          ANALYSIS
        </HeroTitle>
        <Subtitle>
          {/* Delete and edit effect, verify your daily listens, Analyze your daily */}
          Stop guessing. Get raw, unfiltered insights into your Spotify
          playlists.
        </Subtitle>

        <Link href="/api/login" passHref>
          <CtaButton>Log in with Spotify</CtaButton>
        </Link>
      </Main>

      {/* More about what is different about this service */}
      {/* Something on metadata, privacy policy, terms of service, etc. */}

      {/* <Grid>
                <FeatureBox>
                    <h3>01. Metadata Munging</h3>
                    <p>We crunch release dates, popularity scores, and artist diversity to give you a "Hipster Index" and "Diversity Score".</p>
                </FeatureBox>
                <FeatureBox>
                    <h3>02. Genre Clouds</h3>
                    <p>Visualize the sonic texture of your playlists through weighted genre distribution.</p>
                </FeatureBox>
                 <FeatureBox>
                    <h3>03. The Roast</h3>
                    <p>Our AI judges your taste based on cold, hard data. It might hurt, but it's true.</p>
                </FeatureBox>
            </Grid> */}
    </Wrapper>
  );
};

export default LandingPage;
