import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// import components
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { Query } from "./Query";
import { Upload } from "./upload_component/Upload";

export function Routes(props) {
  return (
    <Switch>
      <Route path="/login">
        {props.isLoggedIn ? (
          <Redirect to="/dashboard" />
        ) : (
          <Login
            setIsLoggedIn={props.setIsLoggedIn}
            setIsAdmin={props.setIsAdmin}
            setCookie={props.setCookie}
            setUserInfo={props.setUserInfo}
          />
        )}
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
        <Dashboard
          isAdmin={props.isAdmin}
          userInfo={props.userInfo}
          setIsLoggedIn={props.setIsLoggedIn}
          removeCookie={props.removeCookie}
          setUserInfo={props.setUserInfo}
        />
      </Route>
      <Route path="/upload/:type">
        <Upload />
      </Route>
      <AdminRoutes {...props} />
    </Switch>
  );
}

function AdminRoutes(props) {
  return (
    <Switch>
      {props.isAdmin ? (
        <Route path="/query">
          <Query
            isAdmin={props.isAdmin}
            userInfo={props.userInfo}
            setIsLoggedIn={props.setIsLoggedIn}
            removeCookie={props.removeCookie}
            setUserInfo={props.setUserInfo}
          />
        </Route>
      ) : (
        <Redirect to="/dashboard" />
      )}
    </Switch>
  );
}
