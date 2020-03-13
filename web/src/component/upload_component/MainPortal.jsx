import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  Heading,
  Tooltip,
  Icon,
  Position,
  Dialog,
  toaster
} from "evergreen-ui";
import { PictureSection, VideoSection, SurveySection } from "./Section";

import "../../css/Upload.scss";

function dialogController(setConfDialState) {
  let open = () => setConfDialState({ isShown: true, isLoading: false });
  let close = () => setConfDialState({ isShown: false, isLoading: false });
  let load = () => setConfDialState({ isShown: true, isLoading: true });

  return {
    open: open,
    close: close,
    load: load
  };
}

export function MainPortal(props) {
  let history = useHistory();
  const sessionData = props.data;
  const currSession = props.currSession;

  const [confDialState, setConfDialState] = useState({
    isShown: false,
    isLoading: false
  });

  const [showGiveUp, setshowGiveUp] = useState(false);

  let controlConfirm = dialogController(setConfDialState);

  function sendSession() {
    controlConfirm.load();
    window.setTimeout(() => {
      toaster.success("Successfully upload");
      controlConfirm.close();
      history.push("/dashboard");
    }, 2000);
  }

  let uploadClassName = "primary-button disabled";

  if (
    currSession.picture.length === sessionData.pictures.length &&
    currSession.video.length === sessionData.videos.length &&
    currSession.survey.length === sessionData.surveys.length
  ) {
    uploadClassName = "primary-button";
  }

  return (
    <div>
      <div id="upload-body-session">
        <Heading size={900} marginTop="40px">
          {sessionData.title}
          <Tooltip content={sessionData.desc} position={Position.RIGHT}>
            <Icon icon="info-sign" marginLeft="10px" />
          </Tooltip>
        </Heading>
      </div>
      <VideoSection
        sessionData={sessionData}
        video={currSession.video}
        setVideo={props.setVideo}
      />
      <PictureSection
        sessionData={sessionData}
        picture={currSession.picture}
        setPicture={props.setPicture}
      />
      <SurveySection
        sessionData={sessionData}
        survey={currSession.survey}
        viewSwitcher={props.viewSwitcher}
      />
      <div className="submit-button-group">
        <div className={uploadClassName} onClick={controlConfirm.open}>
          Upload
        </div>
        <div
          className="cancel-button"
          onClick={() => {
            setshowGiveUp(true);
          }}
        >
          Cancel
        </div>
      </div>

      <Dialog
        isShown={confDialState.isShown}
        isConfirmLoading={confDialState.isLoading}
        onCancel={close => {
          if (confDialState.isLoading) {
            return;
          } else {
            close();
          }
        }}
        onConfirm={sendSession}
        confirmLabel={confDialState.isLoading ? "Uploading..." : "Upload"}
        onCloseComplete={controlConfirm.close}
        preventBodyScrolling
        shouldCloseOnEscapePress={!confDialState.isLoading}
        shouldCloseOnOverlayClick={!confDialState.isLoading}
        cancelLabel="Cancel"
        title="Upload Confirmation"
        intent="warning"
      >
        Are you ready to upload ?
      </Dialog>

      <Dialog
        isShown={showGiveUp}
        onConfirm={() => {
          setshowGiveUp(false);
          history.push("/dashboard");
        }}
        confirmLabel="Quit"
        preventBodyScrolling
        cancelLabel="Cancel"
        onCloseComplete={() => setshowGiveUp(false)}
        title="Quit Confirmation"
        intent="warning"
      >
        Do you want to leave the assessment? All changes will not be saved.
      </Dialog>
    </div>
  );
}
