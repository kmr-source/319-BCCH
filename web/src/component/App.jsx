import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Header } from "./Header";

// import components
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { Upload } from "./upload_component/Upload";

// import css
import "../css/App.scss";

let FakeSessionData = {
  sessionTitle: "Session A: Sleep Assessment",
  videos: ["sleep_record", "play_record", "walk_record"],
  pictures: ["front-selfie", "side-selfie"],
  surveys: [{ titile: "Survey A" }, { title: "Survey B" }]
};

export function App() {
  return (
    <div>
      <Header />
      <Router>
        <div className="component-app">
          <nav>
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/upload">upload</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/upload">
              <Upload session={FakeSessionData} />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
