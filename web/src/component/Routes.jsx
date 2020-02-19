import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// import components
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { Upload } from "./upload_component/Upload";

let FakeSessionData = {
  sessionTitle: "Session A: Sleep Assessment",
  videos: ["sleep_record", "play_record", "walk_record"],
  pictures: ["front-selfie", "side-selfie"],
  surveys: [{ titile: "Survey A" }, { title: "Survey B" }]
};

export function Routes(props) {
  return (
    <Switch>
      <Route path="/login">
        <Login
          setIsLoggedIn={props.setIsLoggedIn}
          setIsAdmin={props.setIsAdmin}
        />
      </Route>
      {props.isLoggedIn ? (
        <ProtectedRoutes {...props} />
      ) : (
        <Redirect to="/login" />
      )}
    </Switch>
  );
}

function ProtectedRoutes(props) {
  return (
    <Switch>
      <Route path="/dashboard">
        <Dashboard {...props} />
      </Route>
      <Route path="/upload">
        <Upload session={FakeSessionData} />
      </Route>
    </Switch>
  );
}
