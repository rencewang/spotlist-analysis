import styled from 'styled-components';

export const Page = styled.section`
  margin: 10px 30px;

  @media screen and (max-width: 700px) {
    margin: 10px;
  }
`;

export const Table = styled.table`
  width: 100%;
  height: fit-content;
  border-radius: 10px;
  border-spacing: 0;
  margin: 10px 0 80px 0;

  button {
    &:active {
      top: 2px;
      position: relative;
    }
  }
`;

export const TableHead = styled.thead`
  z-index: 100;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.backgroundColor};

  th {
    text-align: left;
    padding: 10px;
    border-bottom: 2px solid;
  }
`;

export const TableBody = styled.tbody`
  tr {
    td {
      padding: 10px;
      position: relative;
    }
    &:nth-child(even) {
      background-color: rgba(255, 255, 255, 20%);
    }
  }
`;

export const TracklistTableHead = styled(TableHead)`
  @media screen and (max-width: 700px) {
    display: none;
  }
`;

export const TracklistTableBody = styled(TableBody)`
  @media screen and (max-width: 700px) {
    display: flex;
    flex-direction: column;
    tr {
      border-bottom: 2px solid;
      td {
        display: flex;
        padding: 5px 20px;
        &:nth-of-type(2) {
          padding-top: 30px;
        }
        &:last-of-type {
          padding-bottom: 30px;
        }
        &::before {
          content: attr(label);
          font-weight: bold;
          width: 120px;
          min-width: 120px;
        }
        &[label='#'] {
          display: none;
        }
      }
    }
  }
`;

export const AnalysisTables = styled.div`
  display: flex;
  flex-direction: row;
  > table {
    width: 50% !important;
  }

  @media screen and (max-width: 700px) {
    flex-direction: column;
    > table {
      width: 100% !important;
    }
  }
`;
