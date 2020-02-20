import React, { useState, useEffect } from "react";
import { Spinner } from "evergreen-ui";
import { useHistory, useParams } from "react-router-dom";
import { PortalViewControl } from "./PortalViewControl";
import axios from "axios";

import "../../css/Upload.scss";

function Loading(props) {
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

async function fetchSession(type, setLoading, setData) {
  let res = await axios.get(`/assessment/${type}`);
  setData(res.data);
  setLoading(false);
}

export function Upload() {
  let { type } = useParams();

  let [isLoading, setLoading] = useState(true);
  let [sessionData, setData] = useState({
    title: "",
    id: "",
    desc: "",
    pictures: [],
    videos: [],
    surveys: []
  });

  useEffect(() => {
    fetchSession(type, setLoading, setData);
  }, []);

  let currentSession = {
    id: type,
    video: [],
    picture: [],
    survey: []
  };

  // debug
  window.debugP = currentSession;

  let updateSession = (key, val) => {
    currentSession[key] = val;
  };

  let getSession = key => {
    return currentSession[key];
  };

  return (
    <div id="upload-container">
      <div id="upload-body-section">
        <div id="upload-body-main">
          <Loading isLoading={isLoading}>
            <PortalViewControl
              update={updateSession}
              get={getSession}
              data={sessionData}
            />
          </Loading>
        </div>
      </div>
    </div>
  );
}
