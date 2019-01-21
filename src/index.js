import ReactDOM from 'react-dom';
import Portfolio from './App';
import React from 'react';

import {
  BrowserRouter as Router
} from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(  <Router><Portfolio/></Router>, document.getElementById('root'));
registerServiceWorker();
