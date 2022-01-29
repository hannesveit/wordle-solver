import React from 'react';
import WordleGrid from './WordleGrid';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      n: 5,
      maxGuesses: 6,
      game: [
        {word: "LATER", response: "--y-y"},
        {word: "TORUS", response: "ygy--"},
      ],
      currentWord: "ROBO",
      currentWordLocked: false,
      currentColors: "",
    }
  }

  backendHost = (
    process.env.NODE_ENV === "production"
    ? "TBD"  // TODO
    : "localhost:8080"
  );

  componentDidMount() {
    fetch("http://" + this.backendHost + "/")
    .then(resp => resp.json())
    .then(json => this.setState(s => ({...s, x: json})))
  }

  render() {
    let x = JSON.stringify(this.state.x)

    return (
      <div>
        <h1>Hello, World!</h1>
        <p>Backend test: {x}</p>
        <WordleGrid
          n={this.state.n}
          maxGuesses={this.state.maxGuesses}
          game={[...this.state.game, {word: this.state.currentWord, response: null}]}
        />
      </div>
    )
  }
}

export default App
