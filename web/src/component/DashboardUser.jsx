import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { SideSheet, toaster, Icon } from "evergreen-ui";
import axios from "axios";

// import css
import "../css/DashboardUser.scss";

function UploadIcon(props) {
  return (
    <div
      className="dashboard-button"
      onClick={() => {
        props.setCurView("session");
      }}
    >
      Upload
    </div>
  );
}

function InfoButton(props) {
  return (
    <div className="dashboard-button" onClick={() => props.showInfo(true)}>
      Info
    </div>
  );
}

function LogOutButton(props) {
  let history = useHistory();
  function logOut() {
    props.setUserInfo({
      username: "",
      displayName: "",
      gender: "",
      birthdate: "",
      type: ""
    });
    props.setIsLoggedIn(false);
    props.removeCookie("access_token");
    history.push("/login");
  }

  return (
    <div className="negative-button" onClick={logOut}>
      Log out
    </div>
  );
}

function checkTime() {
  let currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning!";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good afternoon!";
  } else if (currentHour >= 18 || currentHour < 5) {
    return "Good Evening!";
  } else {
    return "Hello!";
  }
}

function DashUserMenu(props) {
  const userInfo = props.userInfo;
  let [showInfo, setShowInfo] = useState(false);

  return (
    <div>
      <div className="left-container">
        <p className="dash-board-greeting">{checkTime()}</p>
        <div className="dash-board-username">{userInfo.displayName}</div>
        <UploadIcon setCurView={props.setCurView} />
        <InfoButton showInfo={setShowInfo} />
        <LogOutButton {...props} />
      </div>

      <SideSheet
        isShown={showInfo}
        width={400}
        onCloseComplete={() => {
          setShowInfo(false);
        }}
      >
        <div className="right-container">
          <div className="field-container">Name:</div>
          <div className="content-container">{userInfo.displayName}</div>
          <div className="field-container">Gender:</div>
          <div className="content-container">{userInfo.gender}</div>
          <div className="field-container">Date of Birth:</div>
          <div className="content-container">{userInfo.birthdate}</div>
        </div>
      </SideSheet>
    </div>
  );
}

function SessionMenu(props) {
  let [allSessions, setAllSessions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get("/available");
        setAllSessions(res.data);
      } catch (e) {
        toaster.danger(e.message);
      }
    })();
  }, []);

  let sessionLinks = allSessions.map(s => {
    return (
      <div
        className="session-link-container"
        key={`session-link-${s.id}`}
        title={s.title}
      >
        <Link className="session-link" to={`/upload/${s.id}`}>
          <Icon icon="caret-right"></Icon>
          {s.title}
        </Link>
      </div>
    );
  });

  return (
    <div className="session-menu-container">
      <div className="session-menu-title">Select an assessment to upload</div>
      <div className="session-item-container">{sessionLinks}</div>
      <div
        className="negative-button"
        onClick={() => {
          props.setCurView("menu");
        }}
      >
        Back
      </div>
    </div>
  );
}

export function DashboardUser(props) {
  let [curView, setCurView] = useState("menu");

  return (
    <div id="dash-board-user-container">
      <div id="dash-board-user-main">
        <div style={{ display: curView === "menu" ? "block" : "none" }}>
          <DashUserMenu {...props} setCurView={setCurView} />
        </div>
        <div style={{ display: curView === "session" ? "block" : "none" }}>
          <SessionMenu {...props} setCurView={setCurView} />
        </div>
      </div>
    </div>
  );
}
