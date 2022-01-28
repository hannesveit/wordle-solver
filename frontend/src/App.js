import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: {},
    }
  }

  backendHost() {
    if (process.env.NODE_ENV === "production") {
      return "TBD";  // TODO
    }
    else {
      return "localhost:8080";
    }
  }

  componentDidMount() {
    fetch("http://" + this.backendHost() + "/")
    .then(resp => resp.json())
    .then(json => this.setState(s => ({...s, x: json})))
  }

  render() {
    let x = JSON.stringify(this.state.x);

    return (
      <div>
        <h1>Hello, World!</h1>
        <p>Backend test: {x}</p>
      </div>
    );
  }
}

export default App;
