import React from 'react'

const Analysis = (props) => {
    const {artists, genres} = props
    
    return (
        <div className="listing-container">

          <section className="listing-table" id="playlist-artists">
            {artists.map((item, index) => (
              <div key={index}>
                <div>{item.name}:{item.count}</div>
              </div>
            ))}
          </section>

          <section className="listing-table" id="playlist-genres">
            {genres.map((item, index) => (
              <div key={index}>
                <div>{item.name}:{item.count}</div>
              </div>
            ))}
          </section>
        </div>
    )
}

export default Analysis