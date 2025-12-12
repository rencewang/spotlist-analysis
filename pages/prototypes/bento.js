import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Link from 'next/link';

// --- STYLES ---

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
    color: #fff;
    background: #080808;
  }
`;

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  z-index: 100;
  background: rgba(8,8,8,0.8);
  backdrop-filter: blur(10px);

  a {
    color: #666;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 600;
    &:hover, &.active {
      color: #fff;
    }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 1rem 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, border-color 0.2s;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &.large {
    grid-column: span 2;
    grid-row: span 2;
  }
  
  &.wide {
    grid-column: span 2;
  }
  
  &.tall {
    grid-row: span 2;
  }
  
  &.gradient-bg::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at 100% 0%, rgba(138, 43, 226, 0.15) 0%, rgba(0,0,0,0) 50%);
    z-index: 0;
  }
`;

const Label = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

const Value = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -1px;
  margin-bottom: auto;
  position: relative;
  z-index: 1;
  font-variant-numeric: tabular-nums;
  
  span.unit {
    font-size: 1rem;
    color: rgba(255,255,255,0.4);
    margin-left: 0.25rem;
  }
`;

const ChartPlaceholder = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  margin-top: 1rem;
  
  div {
    flex: 1;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
    transition: height 0.3s;
    &:hover { background: rgba(255,255,255,0.3); }
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  
  li {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.9rem;
    
    &:last-child { border-bottom: none; }
    
    span.rank { color: rgba(255,255,255,0.3); width: 20px; }
    span.name { font-weight: 500; }
    span.count { font-family: 'SF Mono', monospace; color: rgba(255,255,255,0.5); }
  }
`;

const ShareHeader = styled.div`
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: end;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: -2px;
    margin: 0;
    background: linear-gradient(to right, #fff, #999);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const BentoPrototype = () => {
  return (
    <>
      <GlobalStyle />
      <NavContainer>
         <Link href="/prototypes/aurora"><a>Round 1</a></Link>
         <span style={{color:'#333'}}>|</span>
         <Link href="/prototypes/bento"><a className="active">Bento</a></Link>
         <Link href="/prototypes/editorial"><a>Editorial</a></Link>
         <Link href="/prototypes/swiss-dense"><a>Swiss Dense</a></Link>
      </NavContainer>

      <Container>
        <ShareHeader>
            <div>
                <Label>PLAYLIST ANALYSIS</Label>
                <Title>Late Night Drive</Title>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', gap: '1rem'}}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>132</div>
                    <Label style={{marginBottom: 0}}>TRACKS</Label>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>8h</div>
                    <Label style={{marginBottom: 0}}>HOURS</Label>
                 </div>
            </div>
        </ShareHeader>

        <Grid>
            {/* Vibe Score */}
            <Card className="gradient-bg">
                <Label>Vibe Check</Label>
                <Value>Melancholy</Value>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                    Sad boi hours detected. Matches 80% with "Rainy Day".
                </div>
            </Card>

            {/* Main Stats */}
            <Card>
                <Label>Hipster Index</Label>
                <Value>84<span className="unit">%</span></Value>
                <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', marginTop: 'auto', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: '84%', background: '#fff', borderRadius: '2px' }}></div>
                </div>
            </Card>

             {/* Top Artists - Tall Card */}
            <Card className="tall">
                <Label>Top Artists</Label>
                <List>
                    {[
                        {n: 'Beach House', c: 14},
                        {n: 'Tame Impala', c: 9},
                        {n: 'Radiohead', c: 8},
                        {n: 'Cocteau Twins', c: 6},
                        {n: 'Men I Trust', c: 5},
                        {n: 'The 1975', c: 5},
                    ].map((a, i) => (
                        <li key={i}>
                            <div>
                                <span className="rank">{i+1}</span>
                                <span className="name">{a.n}</span>
                            </div>
                            <span className="count">{a.c}</span>
                        </li>
                    ))}
                </List>
            </Card>

             {/* Decade Dist - Wide */}
            <Card className="wide">
                <Label>Time Machine</Label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', height: '100%' }}>
                     <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>2010s</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Dominant Era</div>
                     </div>
                     <ChartPlaceholder style={{ maxWidth: '60%' }}>
                        {[20, 30, 80, 50, 40].map((h,i) => <div key={i} style={{ height: `${h}%` }}></div>)}
                     </ChartPlaceholder>
                </div>
            </Card>

            {/* Small Stat */}
            <Card>
                <Label>Explicitness</Label>
                <Value>12<span className="unit">%</span></Value>
            </Card>
             <Card>
                <Label>Avg Popularity</Label>
                <Value>42<span className="unit">/100</span></Value>
            </Card>

             {/* Roast - Large */}
            <Card className="large gradient-bg">
                <Label>AI Roast 🔥</Label>
                <div style={{ fontSize: '1.5rem', lineHeight: '1.4', fontWeight: 500, marginTop: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                    "This playlist screams 'I own a film camera but never develop the photos.' It's giving main character energy but in an indie movie that got 40% on Rotten Tomatoes."
                </div>
            </Card>

        </Grid>

      </Container>
    </>
  );
};

export default BentoPrototype;
