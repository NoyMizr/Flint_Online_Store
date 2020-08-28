import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import App from './App';
import Login from './components/Login';
import Category from './components/Category';
import Registration from "./components/Registration";

import * as serviceWorker from './serviceWorker';
import Product from "./components/Product";

ReactDOM.render(
  <React.StrictMode>
    <Login/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
