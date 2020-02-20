import React from "react";

import { DashboardUser } from "./DashboardUser";
import { DashboardAdmin } from "./DashboardAdmin";

export function Dashboard(props) {
  return props.isAdmin ? <DashboardAdmin /> : <DashboardUser />;
}
