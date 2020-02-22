import React from "react";
import { Spinner } from "evergreen-ui";

import "../css/Loading.scss";

export function Loading(props) {
  return (
    <div>
      <div
        className="loading"
        style={{ display: props.isLoading ? "block" : "none" }}
      >
        <Spinner marginX="auto" size={100} />
      </div>
      <div
        className="afterLoading"
        style={{ display: props.isLoading ? "none" : "block" }}
      >
        {props.children}
      </div>
    </div>
  );
}
