import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// import css
import "../css/Login.scss";

export function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUserActive, setIsUserActive] = useState(false);
  const [isPassActive, setIsPassActive] = useState(false);

  let history = useHistory();

  function fieldOnFocus(e) {
    const target = e.target;
    const name = target.name;

    switch (name) {
      case "username":
        setIsUserActive(true);
        break;
      case "password":
        setIsPassActive(true);
        break;
    }
  }

  function fieldOnBlur(e) {
    const target = e.target;
    const name = target.name;

    switch (name) {
      case "username":
        setIsUserActive(username !== "");
        break;
      case "password":
        setIsPassActive(password !== "");
        break;
    }
  }

  function inputOnChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  }

  function handleClick() {
    props.setIsLoggedIn(true);
    if (username === "BCCH") {
      props.setIsAdmin(true);
    }
    history.push("/dashboard");
  }

  let userFieldName = "field-container";
  let passFieldName = "field-container";

  if (isUserActive) {
    userFieldName += " active";
  }

  if (isPassActive) {
    passFieldName += " active";
  }

  return (
    <div className="login-page">
      <div className="login-content">
        <form className="login-form">
          <div className="form-title">Login</div>
          <div className={userFieldName}>
            <input
              className="field-box input"
              type="text"
              name="username"
              value={username}
              onChange={inputOnChange}
              onFocus={fieldOnFocus}
              onBlur={fieldOnBlur}
            />
            <label className="field-label">Username</label>
          </div>
          <div className={passFieldName}>
            <input
              className="field-box input"
              type="password"
              name="password"
              value={password}
              onChange={inputOnChange}
              onFocus={fieldOnFocus}
              onBlur={fieldOnBlur}
            />
            <label className="field-label">Password</label>
          </div>
          <div
            className="login-button"
            onClick={() => {
              handleClick();
            }}
          >
            Login
          </div>
        </form>
      </div>
    </div>
  );
}
