import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// import components
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { Query } from "./Query";
import { Upload } from "./upload_component/Upload";
import { AssessmentCreator } from "./AssessmentCreator";

export function Routes(props) {
  return (
    <Switch>
      <Route path="/login">
        <LoginRoute {...props} />
      </Route>
      <ProtectedRoutes {...props} />
    </Switch>
  );
}

function LoginRoute(props) {
  if (props.isLoggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Login
      setIsLoggedIn={props.setIsLoggedIn}
      setCookie={props.setCookie}
      setUserInfo={props.setUserInfo}
    />
  );
}

function ProtectedRoutes(props) {
  if (!props.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <Switch>
      <Route path="/dashboard">
        <Dashboard
          userInfo={props.userInfo}
          setIsLoggedIn={props.setIsLoggedIn}
          removeCookie={props.removeCookie}
          setUserInfo={props.setUserInfo}
        />
      </Route>
      <PermittedRoutes {...props} />
    </Switch>
  );
}

function PermittedRoutes(props) {
  const userType = props.userInfo.type;

  switch (userType) {
    case "user":
      return <UserRoutes />;
    case "admin":
      return <AdminRoutes {...props} />;
    default:
      return <Redirect to="/login" />;
  }
}

function UserRoutes() {
  return (
    <Switch>
      <Route path="/upload/:type">
        <Upload />
      </Route>
      <UndefinedRoute />
    </Switch>
  );
}

function AdminRoutes(props) {
  return (
    <Switch>
      <Route path="/query">
        <Query
          userInfo={props.userInfo}
          setIsLoggedIn={props.setIsLoggedIn}
          removeCookie={props.removeCookie}
          setUserInfo={props.setUserInfo}
        />
      </Route>
      <Route path="/createAssessment">
        <AssessmentCreator />
      </Route>
      <UndefinedRoute />
    </Switch>
  );
}

function UndefinedRoute() {
  return (
    <Route path="/">
      <Redirect to="/dashboard" />
    </Route>
  );
}
