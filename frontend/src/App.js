import React from "react";
import Button from "react-bootstrap/Button";
import CreatableSelect from "react-select/creatable";

import WordleGrid from "./WordleGrid";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    const n = 5;
    const initialColors = Array.from(Array(n)).map(() => null);
    this.state = {
      n: n,
      maxGuesses: 6,
      game: [],
      initialColors: initialColors,
      currentColors: [...initialColors],
      currentWord: null,
      currentSuggestions: [],
      fetchingSuggestions: false,
      gameStatus: "playing",
    };
  }

  backendHost =
    process.env.NODE_ENV === "production"
      ? "https://ws-backend-swa2vbqxja-uc.a.run.app"
      : "http://localhost:8080";

  statusText = {
    playing: "Click letters to enter colors!",
    won: "Sweet! Solved!",
    outOfGuesses: "We're out of guesses :(",
    noSolutionsLeft: "No valid solutions left :(",
  };

  componentDidMount() {
    this.fetchSuggestions();
  }

  fetchSuggestions() {
    this.setState(
      (s) => ({ ...s, fetchingSuggestions: true }),
      () => {
        fetch(this.backendHost + "?n_suggestions=50&game=" + this.gameStr())
          .then(handleFetchErrors)
          .then((resp) => resp.json())
          .then((json) => {
            const newCurrentWord = json.suggestions.length
              ? json.suggestions[0]
              : null;
            let gameStatus = this.state.gameStatus;
            let currentColors = this.state.currentColors;
            if (this.state.game.length > this.state.n) {
              gameStatus = "outOfGuesses";
            } else if (json.suggestions.length == 1) {
              gameStatus = "won";
              currentColors = Array.from(Array(this.state.n)).map(() => "g");
            } else if (!newCurrentWord) {
              gameStatus = "noSolutionsLeft";
            }
            this.setState((s) => ({
              ...s,
              currentSuggestions: json.suggestions,
              currentWord: newCurrentWord,
              fetchingSuggestions: false,
              gameStatus: gameStatus,
              currentColors: currentColors,
            }));
          })
          .catch((error) => {
            alert("Error: " + error);
          });
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
      this.setState((s) => ({
        ...s,
        currentWord: newWord,
        currentColors: [...this.state.initialColors],
      }));
    } else {
      alert(
        `"${newWord}" is invalid. Choose a word of length ${this.state.n} ` +
          "containing only letters."
      );
    }
  };

  handleColorsConfirmed = () => {
    const confirmedColors = this.state.currentColors.join("");
    let gameStatus = this.state.gameStatus;
    if (confirmedColors === "g".repeat(this.state.n)) {
      gameStatus = "won";
    }
    this.setState(
      (s) => ({
        ...s,
        game: [
          ...this.state.game,
          {
            word: this.state.currentWord,
            response: confirmedColors,
          },
        ],
        currentWord: null,
        currentColors: [...this.state.initialColors],
        gameStatus: gameStatus,
      }),
      () => {
        if (gameStatus !== "won") {
          this.fetchSuggestions();
        }
      }
    );
  };

  handleSwitchColor = (i) => {
    if (this.state.gameStatus !== "playing") {
      return;
    }
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

    return (
      <>
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
          disabled={this.state.currentColors.includes(null)}
          onClick={this.handleColorsConfirmed}
        >
          Confirm
        </Button>
      </>
    );
  }

  render() {
    let wordleInputForm = this.renderWordSelect();
    if (this.state.gameStatus !== "playing") {
      wordleInputForm = (
        <div className="reset-button">
          <Button onClick={this.handleReset}>Start over</Button>
        </div>
      );
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
            <p className="status-text">
              {this.statusText[this.state.gameStatus]}
            </p>
            <div className="wordle-input-form">{wordleInputForm}</div>
            <div className="wordle-container">
              <WordleGrid
                n={this.state.n}
                maxGuesses={this.state.maxGuesses}
                game={this.state.game}
                currentWord={this.state.currentWord}
                currentColors={this.state.currentColors}
                handleSwitchColor={this.handleSwitchColor}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function handleFetchErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export default App;
