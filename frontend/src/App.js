import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: "Hello, World!"
    }
  }

  render() {
    let x = this.state.x;

    return (
      <div>
        <h1>{x}</h1>
      </div>
    );
  }
}

export default App;
