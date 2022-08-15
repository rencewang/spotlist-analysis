import React from 'react';

import * as Styled from '../styles/pages';
import * as General from '../styles/general';

const Analysis = (props) => {
  const { name, artists, genres, downloaded } = props;

  const AnalysisToCSV = () => {
    const output = [];
    for (let i = 0; i < Math.max(artists.length, genres.length); i++) {
      let rowContent =
        '"' +
        (artists[i]
          ? i + 1 + '","' + artists[i].name + '","' + artists[i].count
          : ' ' + '","' + ' ' + '","' + ' ') +
        '","' +
        (genres[i]
          ? i + 1 + '","' + genres[i].name + '","' + genres[i].count
          : ' ' + '","' + ' ' + '","' + ' ') +
        '"';
      output.push(rowContent);
    }
    return (
      'artist_rank, artist, artist_count, genre_rank, genre, genre_count \r\n' +
      output.join('\r\n')
    );
  };

  const DownloadCSV = (event, generate_function, name) => {
    event.preventDefault();
    // Create a blob
    var blob = new Blob([generate_function], {
      type: 'text/csv;charset=utf-8;',
    });
    var url = URL.createObjectURL(blob);
    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', `spotlist-analysis-${name}.csv`);
    pom.click();
  };

  // Disply copied & downloaded alert
  const ShowAlert = (ref) => {
    ref.current.style.opacity = 1;
    ref.current.style.display = 'block';
    setTimeout(() => (ref.current.style.opacity = 0), 500);
    setTimeout(() => (ref.current.style.display = 'none'), 700);
  };

  return (
    <Styled.Page>
      <General.Button
        className="download"
        onClick={(e) => {
          DownloadCSV(e, AnalysisToCSV(), name.label);
          ShowAlert(downloaded);
        }}
      >
        Download full analysis as CSV
      </General.Button>

      <Styled.AnalysisTables>
        <Styled.Table>
          <Styled.TableHead>
            <tr>
              <th>Rank</th>
              <th>Artist</th>
              <th>Count</th>
            </tr>
          </Styled.TableHead>
          <Styled.TableBody>
            {artists.slice(0, 30).map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </Styled.TableBody>
        </Styled.Table>

        <Styled.Table>
          <Styled.TableHead>
            <tr>
              <th>Rank</th>
              <th>Genre</th>
              <th>Count</th>
            </tr>
          </Styled.TableHead>
          <Styled.TableBody>
            {genres.slice(0, 30).map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </Styled.TableBody>
        </Styled.Table>
      </Styled.AnalysisTables>
    </Styled.Page>
  );
};

export default Analysis;
