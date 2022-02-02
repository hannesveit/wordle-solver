import React from "react";
import Button from "react-bootstrap/Button";
import CreatableSelect from "react-select/creatable";

import WordleGrid from "./WordleGrid";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    const n = 5;
    this.state = {
      n: n,
      maxGuesses: 6,
      game: [],
      currentWord: null,
      currentColors: Array.from(Array(n)).map(() => null),
      currentSuggestions: [],
      fetchingSuggestions: false,
      pickingColors: false,
      gameOver: false,
    };
  }

  backendHost =
    process.env.NODE_ENV === "production"
      ? "TBD" // TODO
      : "localhost:8080";

  componentDidMount() {
    this.fetchSuggestions();
  }

  fetchSuggestions() {
    this.setState(
      (s) => ({ ...s, fetchingSuggestions: true }),
      () => {
        fetch(
          "http://" +
            this.backendHost +
            "/suggestions?n_suggestions=50&game=" +
            this.gameStr()
        )
          .then((resp) => resp.json())
          .then((json) => {
            const newCurrentWord = json.suggestions.length
              ? json.suggestions[0]
              : null;
            this.setState((s) => ({
              ...s,
              currentSuggestions: json.suggestions,
              currentWord: newCurrentWord,
              fetchingSuggestions: false,
              gameOver:
                newCurrentWord && this.state.game.length <= this.state.n
                  ? false
                  : true,
            }));
          });
        // TODO: error handling
      }
    );
  }

  gameStr() {
    return this.state.game
      .map((guess) => guess.word + ":" + guess.response)
      .join(",");
  }

  handleSelectChange = (option) => {
    if (!option || !option.value) {
      return;
    }
    const newWord = option.value.toUpperCase();
    if (newWord.length === this.state.n && /^[A-Z]+$/.test(newWord)) {
      this.setState((s) => ({ ...s, currentWord: newWord }));
    } else {
      alert(
        `"${newWord}" is invalid. Choose a word of length ${this.state.n} ` +
          "containing only letters."
      );
    }
  };

  handleWordConfirmed = () => {
    this.setState((s) => ({ ...s, pickingColors: true }));
  };

  handleColorsConfirmed = () => {
    const confirmedColors = this.state.currentColors.join("");
    this.setState(
      (s) => ({
        ...s,
        pickingColors: false,
        game: [
          ...this.state.game,
          {
            word: this.state.currentWord,
            response: confirmedColors,
          },
        ],
        currentWord: null,
        currentColors: Array.from(Array(this.state.n)).map(() => null),
      }),
      () => {
        this.fetchSuggestions();
      }
    );
  };

  handleSwitchColor = (i) => {
    const nextColor = { null: "-", "-": "y", y: "g", g: "-" };
    const updatedColors = this.state.currentColors;
    updatedColors[i] = nextColor[updatedColors[i]];
    this.setState((s) => ({ ...s, currentColors: updatedColors }));
  };

  handleReset = () => {
    window.location.reload();
  };

  renderWordSelect() {
    const makeOption = (suggestion) => ({
      value: suggestion,
      label: suggestion,
    });
    const options = this.state.currentSuggestions.length
      ? this.state.currentSuggestions.map(makeOption)
      : [];
    const value = this.state.currentWord
      ? makeOption(this.state.currentWord)
      : null;

    return <>
        <div className="input-form-left">
          <CreatableSelect
            isClearable
            onChange={this.handleSelectChange}
            options={options}
            value={value}
          />
        </div>
        <Button
          className="input-form-button"
          disabled={this.state.fetchingSuggestions}
          onClick={this.handleWordConfirmed}
        >
          Confirm
        </Button>
      </>;
  }

  renderColorSelect() {
    return <>
      <div className="input-form-left">
        <p className="color-select-text">
          Click letters to choose colors!
        </p>
      </div>
      <Button
        className="input-form-button"
        disabled={this.state.currentColors.includes(null)}
        onClick={this.handleColorsConfirmed}
      >
        Confirm
      </Button>
    </>;
  }

  renderGameOver() {
    const msg =
      this.state.game.slice(-1)[0].response === "g".repeat(this.state.n)
        ? "Sweet! You won!"
        : "No valid solutions left :(";
    return <>
      <div className="input-form-left">
        <p className="color-select-text">{msg}</p>
      </div>
      <Button className="input-form-button" onClick={this.handleReset}>
        Reset
      </Button>
    </>
  }

  render() {
    let wordleInputForm = this.renderWordSelect();
    if (this.state.pickingColors) {
      wordleInputForm = this.renderColorSelect();
    } else if (this.state.gameOver) {
      wordleInputForm = this.renderGameOver();
    }

    return (
      <div className="everything">
        <a
          href="https://github.com/hannesveit/wordle-solver"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="Source code on GitHub"
            width={50}
            height={50}
          />
        </a>
        <div className="almost-everything">
          <div className="wordle-app">
          <div className="wordle-input-form">{wordleInputForm}</div>
            <div className="wordle-container">
              <WordleGrid
                n={this.state.n}
                maxGuesses={this.state.maxGuesses}
                game={this.state.game}
                currentWord={this.state.currentWord}
                currentColors={this.state.currentColors}
                pickingColors={this.state.pickingColors}
                handleSwitchColor={this.handleSwitchColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
