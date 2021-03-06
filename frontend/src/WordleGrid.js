import React from "react";

import "./WordleGrid.css";

class WordleGrid extends React.Component {
  render() {
    const P = this.props;
    const totalNumCells = P.maxGuesses * P.n;

    let cells = [];

    for (const guess of P.game) {
      for (let i = 0; i < P.n; i++) {
        cells.push(
          <GridCell
            key={"wordle_cell_" + cells.length}
            letter={guess.word[i]}
            color={guess.response[i]}
          />
        );
      }
    }

    if (P.currentWord && cells.length < totalNumCells) {
      for (let i = 0; i < P.n; i++) {
        cells.push(
          <GridCell
            key={"wordle_cell_" + cells.length}
            letter={P.currentWord[i]}
            color={P.currentColors[i]}
            onClick={() => {
              P.handleSwitchColor(i);
            }}
          />
        );
      }
    }

    for (let i = cells.length; i < totalNumCells; i++) {
      cells.push(
        <GridCell
          key={"wordle_cell_" + cells.length}
          letter={null}
          color={null}
        />
      );
    }

    return <div className="wordle-grid">{cells}</div>;
  }
}

class GridCell extends React.Component {
  render() {
    const P = this.props;
    const cellClassByColor = {
      null: P.letter ? "wordle-cell-with-letter" : "wordle-cell",
      g: "wordle-cell-green",
      y: "wordle-cell-yellow",
      "-": "wordle-cell-gray",
    };
    const cellClass = cellClassByColor[P.color];
    const letterClass = P.color ? "wordle-letter-white" : "wordle-letter-black";
    return (
      <div className={cellClass} onClick={P.onClick}>
        <div className={letterClass} style={{ userSelect: "none" }}>
          {P.letter}
        </div>
      </div>
    );
  }
}

export default WordleGrid;
