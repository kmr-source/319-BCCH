import React from "react";
import { Link } from "react-router-dom";

// import css
import "../css/DashboardUser.scss";

function UploadIcon() {
  return <Link to="/upload">Upload</Link>;
}

export function DashboardUser(props) {
  return (
    <div id="dash-board-user-container">
      <div id="container">
        <div className="left-container">
          <p>Hello,</p>
          <div id="username">@Raymond Chen</div>
          <UploadIcon />
        </div>
        <div className="vertical-line">
          <hr />
        </div>
        <div className="right-container">
          <div id="name-container">Name:</div>
          <div id="real-name">Raymond Chen</div>
          <hr />
          <div id="gender-container">Gender:</div>
          <div id="real-gender">Male</div>
          <hr />
          <div id="dob-container">Date of Birth:</div>
          <div id="real-dob">1997/01/19</div>
          <hr />
        </div>
      </div>
    </div>
  );
}
