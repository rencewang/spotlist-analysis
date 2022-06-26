import styled from "styled-components"

export const Tracklist = styled.section`
`

export const Table = styled.table`
    width: 100%;
    border-radius: 10px;
    border-spacing: 0;
    margin: 10px 0 80px 0;

    button {
        &:active {
            top: 2px;
            position: relative;
        }
    }
`

export const TableHead = styled.thead`
    z-index: 999;
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;

    th {
        text-align: left;
        padding: 10px;
        border-bottom: 2px solid;
    }
`

export const TableBody = styled.tbody`
    tr {
        td {
            padding: 10px;
            position: relative;
        }
        &:nth-child(even) {
            background-color: rgba(255, 255, 255, 10%);
        }
    }
`

