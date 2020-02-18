import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { DashboardUser } from "./DashboardUser";
import { DashboardAdmin } from "./DashboardAdmin";

export function Dashboard() {
  return (
    <Router>
      <div className="component-app">
        <nav>
          <ul>
            <li>
              <Link to="/dashboard-user">DashboardUser</Link>
            </li>
            <li>
              <Link to="/dashboard-admin">DashboardAdmin</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/dashboard-user">
            <DashboardUser />
          </Route>
          <Route path="/dashboard-admin">
            <DashboardAdmin />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
