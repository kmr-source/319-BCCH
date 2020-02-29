import React, { useState } from "react";
import { SurveyPortal } from "./SurveyPortal";
import { MainPortal } from "./MainPortal";

import "../../css/Upload.scss";

export function PortalViewControl(props) {
  let [sessionData, updateSession, getSession] = [
    props.data,
    props.update,
    props.get
  ];

  let [currentView, setCurrentView] = useState("portal");
  let [currentSurvey, setCurrentSurvey] = useState(false);
  let [surveyParams, setParams] = useState({});

  function switchToSurvey(surveyID, updateInfoObj) {
    return () => {
      setCurrentSurvey(surveyID);
      setParams(updateInfoObj);
      setCurrentView("survey");
    };
  }

  function switchToPortal() {
    return () => {
      setCurrentSurvey("");
      setCurrentView("portal");
    };
  }

  function setView(newView) {
    return {
      display: currentView === newView ? "block" : "none"
    };
  }

  return (
    <div className="portal-view-control">
      <div style={setView("portal")}>
        <MainPortal
          data={sessionData}
          update={updateSession}
          get={getSession}
          viewSwitcher={switchToSurvey}
        />
      </div>
      <div style={setView("survey")}>
        <SurveyPortal
          data={sessionData}
          update={updateSession}
          get={getSession}
          currentSurvey={currentSurvey}
          surveyParams={surveyParams}
          viewSwitcher={switchToPortal}
        />
      </div>
    </div>
  );
}
