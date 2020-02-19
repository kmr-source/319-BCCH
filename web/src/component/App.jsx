import React, { useState } from "react";
import { HashRouter as Router, Link } from "react-router-dom";

// import components
import { Header } from "./Header";
import { Routes } from "./Routes";

// import css
import "../css/App.scss";

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="component-app">
      <Router>
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
        <Header isLoggedIn={isLoggedIn} />
        <div id="content">
          <Routes
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            setIsLoggedIn={setIsLoggedIn}
            setIsAdmin={setIsAdmin}
          />
        </div>
      </Router>
    </div>
  );
}
