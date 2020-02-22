import React, { useState, useEffect } from "react";
import { Loading } from "../Loading.jsx";
import { useParams } from "react-router-dom";
import { PortalViewControl } from "./PortalViewControl";
import { toaster } from "evergreen-ui";
import axios from "axios";

import "../../css/Upload.scss";

async function fetchSession(type, setLoading, setData) {
  try {
    let res = await axios.get(`/assessment/${type}`);
    setData(res.data);
    setLoading(false);
  } catch (e) {
    toaster.danger(e.message);
  }
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
