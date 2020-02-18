import React, { useState } from "react";
import { Heading, Dialog, Button, toaster } from "evergreen-ui";
import { PictureSection, VideoSection, SurveySection } from "./Section";
import { useHistory } from "react-router-dom";

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

export function Upload(props) {
  let history = useHistory();
  let sessionData = props.session;

  let currentSession = {
    video: [],
    picture: [],
    survey: []
  };

  // debug purposes
  window.debug = currentSession;

  let updateSession = (key, val) => {
    currentSession[key] = val;
  };

  let [confDialState, setConfDialState] = useState({
    isShown: false,
    isLoading: false
  });

  let controlConfirm = dialogController(setConfDialState);

  function sendSession() {
    controlConfirm.load();
    window.setTimeout(() => {
      toaster.success("Successfully upload");
      controlConfirm.close();
      history.push("/dashboard");
    }, 2000);
  }

  return (
    <div id="upload-container">
      <div id="upload-body-section">
        <div id="upload-body-main">
          <div id="upload-body-session">
            <Heading size={900} marginTop="40px">
              {sessionData.sessionTitle}
            </Heading>
          </div>
          <VideoSection
            videoRequired={sessionData.videos}
            update={updateSession}
          />
          <PictureSection
            pictureRequired={sessionData.pictures}
            update={updateSession}
          />
          <SurveySection
            surveyRequired={sessionData.surveys}
            update={updateSession}
          />
          <div className="submit-button-group">
            <Button
              height={40}
              marginRight={35}
              appearance="primary"
              intent="warning"
              onClick={controlConfirm.open}
            >
              Upload
            </Button>
            <Button intent="warning" height={38} marginRight={16}>
              Cancel
            </Button>
          </div>
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
    </div>
  );
}
