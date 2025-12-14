import styled from 'styled-components';

export const Wrapper = styled.div`
  background: #f0f0f0;
  min-height: 100vh;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #000;
`;

export const Nav = styled.nav`
  position: fixed;
  left: 0; top: 0; bottom: 0;
  width: 50px;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  z-index: 100;
  
  a, span {
    color: #fff;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.7rem;
    margin-bottom: 2rem;
    transform: rotate(180deg);
    opacity: 0.5;
    cursor: pointer;
    
    &:hover, &.active { opacity: 1; }
  }
`;

export const Container = styled.div`
  margin-left: 50px;
  padding: 1rem;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  background: #fff;
  border: 1px solid #000;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  
  h2 {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0 0 1rem;
    border-bottom: 1px solid #000;
    padding-bottom: 0.5rem;
    letter-spacing: 0.5px;
    display: flex;
    justify-content: space-between;
  }
`;

export const SidePanel = styled(Panel)`
    /* The narrow column (Left) */
    @media (min-width: 901px) {
        position: sticky;
        top: 1rem;
        height: calc(100vh - 2rem);
        overflow-y: auto;
    }
`;

export const MainPanel = styled(Panel)`
    /* The wide column (Right) */
    min-height: calc(100vh - 2rem);
`;

export const Header = styled.div`
    margin-bottom: 2rem;
    border-bottom: 2px solid #000;
    padding-bottom: 1rem;
    
    h1 { 
        font-size: 1.8rem; 
        margin: 0; 
        letter-spacing: -1px; 
    }
    
    select {
        margin-top: 0.5rem;
        padding: 0.5rem;
        font-family: 'Menlo', monospace;
        border: 1px solid #000;
        background: #fff;
        width: 100%;
        font-size: 0.8rem;
    }
    
    div.meta {
        font-family: 'Menlo', monospace;
        font-size: 0.7rem; 
        margin-top: 0.5rem; 
        opacity: 0.6;
    }
`;

export const StatRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 2px;
    
    span.label { font-weight: 700; }
    span.val { font-family: 'Menlo', monospace; }
`;

export const Toggle = styled.button`
    background: none;
    border: 1px solid #000;
    font-family: 'Menlo', monospace;
    font-size: 0.6rem;
    cursor: pointer;
    padding: 2px 6px;
    
    &:hover { background: #000; color: #fff; }
    &.active { background: #000; color: #fff; }
`;
