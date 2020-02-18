import React, { useState } from "react";

// import css
import "../css/Login.scss";

export function Login() {
  return (
    <div className="login-page">
      <div className="login-header">
        <div className="header-text">BCCH</div>
      </div>
      <div className="login-content">
        <form className="login-form">
          <div className="form-title"></div>
          <div className="form-username"></div>
          <div className="form-password"></div>
          <button className="login-button"></button>
        </form>
      </div>
    </div>
  );
}
