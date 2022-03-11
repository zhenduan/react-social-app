import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Post from "./components/Post";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { db } from "./firebase";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Reset from "./components/Reset";
import Register from "./components/Register";
import CreatePost from "./components/CreatePost";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/reset" component={Reset} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/create-post" component={CreatePost} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
