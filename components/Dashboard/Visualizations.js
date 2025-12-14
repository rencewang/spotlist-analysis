import styled from 'styled-components';

export const BarChartContainer = styled.div`
    display: flex;
    gap: 2px;
    height: 120px;
    align-items: flex-end;
    margin-bottom: 2rem;
    border-bottom: 1px solid #000;
    padding-bottom: 2px;
    position: relative;
    
    /* Scrollable for Year view */
    overflow-x: auto; 
    min-width: 0;
`;

export const Bar = styled.div`
    flex: 1;
    min-width: ${props => props.thin ? '4px' : 'auto'};
    background: #000;
    position: relative;
    transition: background 0.2s;
    
    &:hover { 
        background: #ff3b30; 
        
        &::after {
            content: attr(data-label);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.7rem;
            font-weight: 700;
            white-space: nowrap;
            background: #000;
            color: #fff;
            padding: 2px 4px;
            pointer-events: none;
            z-index: 10;
        }
    }
`;

export const DenseTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    
    th { 
        text-align: left; 
        border-bottom: 2px solid #000; 
        padding: 6px 4px; 
        text-transform: uppercase;
        font-weight: 700;
    }
    
    td { 
        border-bottom: 1px solid #eee; 
        padding: 6px 4px; 
        font-family: 'Menlo', monospace; 
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }
    
    tr:hover td {
        background: #f0f0f0;
    }
`;

export const GenreCloud = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.75rem;
    line-height: 1.5;
`;

export const GenreTag = styled.span`
    padding: 0 4px;
    border: 1px solid #ccc;
    cursor: default;
    
    &.high {
        background: #000; 
        color: #fff; 
        border-color: #000;
        font-weight: 700;
    }
    
    &.med {
        background: #ddd;
        border-color: #ddd;
        font-weight: 600;
    }
`;

// --- NEW VISUALIZATIONS ---

export const ScatterContainer = styled.div`
    width: 100%;
    height: 300px;
    border: 1px solid #eee;
    margin-bottom: 2rem;
    position: relative;
    background: #fcfcfc;
    
    .axis-label {
        font-size: 0.7rem;
        font-family: 'Menlo', monospace;
        fill: #999;
    }
    
    .grid-line {
        stroke: #eee;
        stroke-width: 1px;
    }
    
    circle {
        fill: #000;
        opacity: 0.6;
        transition: all 0.2s;
        cursor: crosshair;
        
        &:hover {
            opacity: 1;
            fill: #ff3b30;
            r: 6;
        }
    }
`;

export const PieContainer = styled.div`
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0;
    
    path {
        transition: opacity 0.2s;
        cursor: pointer;
        &:hover { opacity: 0.8; }
    }
`;
