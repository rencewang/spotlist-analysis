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
`;

export const Bar = styled.div`
    flex: 1;
    background: #000;
    position: relative;
    transition: background 0.2s;
    
    &:hover { 
        background: #ff3b30; 
        
        &::after {
            content: attr(data-label);
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.7rem;
            font-family: 'Menlo', monospace;
            white-space: nowrap;
            background: #000;
            color: #fff;
            padding: 2px 4px;
            pointer-events: none;
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
