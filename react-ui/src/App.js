import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      fetching: true,
      websocket_message: "",
      mongo_data: []
    };
  }

  componentDidMount() {
    console.log( "component did mount with node env:", process.env.NODE_ENV);
    let ws_url = 'ws://pure-thicket-70312.herokuapp.com/:5000';
    if( process.env.NODE_ENV === 'development'){
      ws_url = "ws://localhost:5000";
    }
    const socket = new WebSocket( ws_url);
    socket.onopen = () => {
      console.log( "socket is open");
      socket.send( JSON.stringify( { action: "get me the data"}));
    };
    socket.onmessage = (message) => {
      console.log( "websocket message:", message);
      const msg = JSON.parse( message.data);
      this.setState( {websocket_message: msg.message});
    };
    fetch( '/api/test')
    .then( (response) => {
      if( !response.ok){
        throw new Error( `api/test failed:${response.status}`);
      }
      return response.json();
    })
    .then( json => {
      console.log( "mongo test data:", json);
      this.setState( { mongo_data: json});
    });
    fetch('/api')
    .then(response => {
      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }
      return response.json();
    })
    .then(json => {
      this.setState({
        message: json.message,
        fetching: false
      });
    }).catch(e => {
      this.setState({
        message: `API call failed: ${e}`,
        fetching: false
      });
    });
  }

  render() {
    const {mongo_data} = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          {'This is '}
          <a href="https://github.com/mars/heroku-cra-node">
            {'create-react-app with a custom Node/Express server'}
          </a><br/>
        </p>
        <p className="App-intro">
          {this.state.fetching
            ? 'Fetching message from API'
            : this.state.message}
        </p>
        <p className="App-intro" >
          test data (name):{mongo_data.length?mongo_data[0].name:"not found"}
        </p>
        <p className="App-intro">
          {this.state.websocket_message.length
            ? `Hello from websocket:${this.state.websocket_message}`
            : "Waiting for websocket"
          }
        </p>
      </div>
    );
  }
}

export default App;
