import ReactDOM from 'react-dom';
import Portfolio from './App';
import React from 'react';

import {
  BrowserRouter as Router
} from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-132875181-1');
ReactGA.pageview(window.location.pathname + window.location.search);



ReactDOM.render(  <Router><Portfolio/></Router>, document.getElementById('root'));
registerServiceWorker();



