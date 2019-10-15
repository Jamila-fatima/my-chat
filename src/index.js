import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route , BrowserRouter as Router} from 'react-router-dom';
import LogInComponent from './LogIn/LogIn';
import SignUpComponent from './SignUp/SignUp';
import DashBoardComponent from './DashBoard/DashBoard';


const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
    apiKey: "AIzaSyBMdqCD7irGttc0z1KZzX9TwwOdJ5xOlL0",
  authDomain: "chat-app-d449a.firebaseapp.com",
  databaseURL: "https://chat-app-d449a.firebaseio.com",
  projectId: "chat-app-d449a",
  storageBucket: "chat-app-d449a.appspot.com",
  messagingSenderId: "163305292760",
  appId: "1:163305292760:web:9288e160873fdecca0a8ad",
  measurementId: "G-F0JWNJBW7V"
});

const routing = (

    <Router>
        <div id= "routing-container">
            <Route path="/LogIn" component = {LogInComponent}></Route>
            <Route path="/SignUp" component = {SignUpComponent}></Route>
            <Route path="/DashBoard" component = {DashBoardComponent}></Route>
            

            {/* fallback route / wildcard */}

        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
