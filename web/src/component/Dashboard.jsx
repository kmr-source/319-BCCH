import React from "react";
import { useHistory } from "react-router-dom";

import { DashboardUser } from "./DashboardUser";
import { DashboardAdmin } from "./DashboardAdmin";

export function Dashboard(props) {
  return props.isAdmin ? <DashboardAdmin /> : <DashboardUser />;
}
