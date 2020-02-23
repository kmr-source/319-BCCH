import React, { useState, useEffect } from "react";
import { HashRouter as Router, Link } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";

// import components
import { Header } from "./Header";
import { Routes } from "./Routes";
import { Loading } from "./Loading";

// import css
import "../css/App.scss";

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    displayName: "",
    gender: "",
    birthdate: "",
    type: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/userInfo`);
      const user = res.data;
      setUserInfo(user);
      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (e) {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUser();
  }, []);

  return (
    <div className="component-app">
      <CookiesProvider>
        <Router>
          <Header
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            removeCookie={removeCookie}
          />
          <div id="content">
            <Loading isLoading={isLoading}>
              <Routes
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                cookies={cookies}
                setCookie={setCookie}
                userInfo={userInfo}
                removeCookie={removeCookie}
                setUserInfo={setUserInfo}
              />
            </Loading>
          </div>
        </Router>
      </CookiesProvider>
    </div>
  );
}
