import React from "react";
import { Spinner } from "evergreen-ui";

import "../css/Loading.scss";

export function Loading(props) {
  return (
    <div>
      {props.isLoading ? (
        <div className="loading">
          <Spinner marginX="auto" size={100} />
        </div>
      ) : (
        <div className="afterLoading">{props.children}</div>
      )}
    </div>
  );
}
