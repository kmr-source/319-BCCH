import React, { useState, useEffect } from "react";
import { HashRouter as Router, Link } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";

// import components
import { Header } from "./Header";
import { Routes } from "./Routes";

// import css
import "../css/App.scss";

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  useEffect(() => {
    if (cookies.access_token) {
      setIsLoggedIn(true);
    }
  });

  return (
    <div className="component-app">
      <CookiesProvider>
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
          <Header
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            removeCookie={removeCookie}
          />
          <div id="content">
            <Routes
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              setIsLoggedIn={setIsLoggedIn}
              setIsAdmin={setIsAdmin}
              cookies={cookies}
              setCookie={setCookie}
            />
          </div>
        </Router>
      </CookiesProvider>
    </div>
  );
}
