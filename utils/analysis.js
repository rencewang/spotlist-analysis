import React from 'react'

import * as Styled from '../styles/pages'

const Analysis = (props) => {
    const {artists, genres} = props
    
    return (
        <Styled.Page>

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
                {artists.slice(0, 20).map((item, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
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
                {genres.slice(0, 20).map((item, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.name}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </Styled.TableBody>
            </Styled.Table>
          </Styled.AnalysisTables>
          
        </Styled.Page>
    )
}

export default Analysis