import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Link from 'next/link';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #111;
    background: #fdfdfd;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
`;

const Sidebar = styled.nav`
  background: #f4f5f7;
  border-right: 1px solid #e1e4e8;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  
  h3 { font-size: 0.75rem; color: #666; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.5px; }
  
  a {
    display: block;
    padding: 0.5rem 0;
    color: #333;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    &:hover { color: #0070f3; }
    &.active { color: #0070f3; font-weight: 600; }
  }
`;

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3rem;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 1rem;
  
  h1 { font-size: 1.5rem; font-weight: 600; margin: 0; }
  span { font-size: 0.9rem; color: #666; font-family: 'Menlo', monospace; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const Card = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  
  h4 { margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #666; font-weight: 500; }
  div.value { font-size: 1.8rem; font-weight: 600; letter-spacing: -0.5px; }
  div.sub { font-size: 0.8rem; color: #888; margin-top: 0.5rem; display: flex; align-items: center; gap: 4px; }
  
  &.wide { grid-column: span 2; }
  &.tall { grid-row: span 2; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  
  th { text-align: left; padding: 0.75rem; border-bottom: 1px solid #eaeaea; color: #666; font-weight: 500; }
  td { padding: 0.75rem; border-bottom: 1px solid #eaeaea; }
  tr:last-child td { border-bottom: none; }
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 60px;
  margin-top: 1rem;
  
  div {
    flex: 1;
    background: #0070f3;
    opacity: 0.2;
    border-radius: 2px 2px 0 0;
    &:hover { opacity: 1; }
  }
`;

const Dot = styled.span`
  display: inline-block;
  width: 8px; 
  height: 8px; 
  border-radius: 50%; 
  background: ${props => props.color || '#ccc'};
`;

const CleanPrototype = () => (
  <>
    <GlobalStyle />
    <Wrapper>
      <Sidebar>
        <h3>My Library</h3>
        <Link href="#"><a className="active">Dashboard</a></Link>
        <Link href="#">Playlists</Link>
        <Link href="#">Artists</Link>
        <Link href="#">Settings</Link>
        
        <h3 style={{ marginTop: '2rem' }}>Playlists</h3>
        <Link href="#">Late Night Drive</Link>
        <Link href="#">Indie Mix</Link>
        <Link href="#">Focus Flow</Link>
      </Sidebar>
      
      <Main>
        <Header>
          <h1>Late Night Drive</h1>
          <span>ID: 849201 • 142 Tracks</span>
        </Header>
        
        <Grid>
          <Card>
            <h4>Hipster Index</h4>
            <div className="value">84%</div>
            <div className="sub"><Dot color="#10b981" /> Underground</div>
          </Card>
          <Card>
            <h4>Diversity Score</h4>
            <div className="value">High</div>
            <div className="sub">92 Unique Artists</div>
          </Card>
          <Card>
            <h4>Top Genre</h4>
            <div className="value">Dream Pop</div>
            <div className="sub">34% of tracks</div>
          </Card>
          <Card>
            <h4>Attention Span</h4>
            <div className="value">TikTok</div>
            <div className="sub">Avg 2:10</div>
          </Card>
          
          <Card className="wide">
            <h4>Decade Distribution</h4>
            <BarChart>
               {[20, 40, 80, 50, 30, 90, 20, 10, 40, 60].map((h, i) => (
                   <div key={i} style={{ height: `${h}%` }} />
               ))}
            </BarChart>
          </Card>
          
          <Card className="wide">
            <h4>Vibe Analysis</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {['Melancholy', 'Atmospheric', 'Lo-Fi', 'Night Drive', 'Nostalgic'].map(t => (
                    <span key={t} style={{ background: '#f4f5f7', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{t}</span>
                ))}
            </div>
          </Card>
        </Grid>
        
        <h3 style={{ marginBottom: '1rem' }}>Top Tracks</h3>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Popularity</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map((_, i) => (
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>Space Song</td>
                            <td>Beach House</td>
                            <td>Depression Cherry</td>
                            <td>82</td>
                            <td>5:20</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Card>
      </Main>
    </Wrapper>
  </>
);

export default CleanPrototype;
