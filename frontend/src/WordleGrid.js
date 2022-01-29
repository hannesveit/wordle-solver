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
        const gi = guess ? guess.word[j] : null
        const ri = guess && guess.response ? guess.response[j] : null
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
    const cellClassByColor = {
      null: P.letter ? 'wordle-cell-with-letter' : 'wordle-cell',
      'g': 'wordle-cell-green',
      'y': 'wordle-cell-yellow',
      '-': 'wordle-cell-gray',
    }
    const cellClass = cellClassByColor[P.color]
    const letterClass = P.color ? 'wordle-letter-white' : 'wordle-letter-black'
    return (
      <div className={cellClass}>
        <div className={letterClass}>
          {P.letter}
        </div>
      </div>
    )
  }
}


export default WordleGrid
