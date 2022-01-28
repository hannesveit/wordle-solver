import React from 'react';
import Grid from 'react-css-grid'

import './WordleGrid.css'


class WordleGrid extends React.Component {
  render() {
    const P = this.props
    const cells = []

    for (let i = 0; i < P.maxGuesses; i++) {
      const guess = (i < P.game.length) ? P.game[i] : null
      for (let j = 0; j < P.n; j++) {
        const [gi, ri] = guess ? [guess.word[j], guess.response[j]] : [null, null]
        cells.push(<GridCell letter={gi} color={ri}/>)
      }
    }

    return (
      <div className="wordle-grid">
        <Grid width={70} gap={5}>
          {cells}
        </Grid>
      </div>
    )
  }
}


class GridCell extends React.Component {
  render() {
    const P = this.props;
    return (
      <div className='wordle-cell'>
        <div className='wordle-letter'>
          {P.letter}
        </div>
      </div>
    )
  }
}


export default WordleGrid
