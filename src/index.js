import ReactDOM from 'react-dom';
import Portfolio from './App';
import React, { Component } from 'react';

import {
  BrowserRouter as Router
} from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


class App extends Component {
    render() {
      return (
        <div className="App">
          <Portfolio/>
        </div>
      );
    }
  }


ReactDOM.render(  <Router><App /></Router>, document.getElementById('root'));
registerServiceWorker();
