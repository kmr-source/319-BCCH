import React, { useState } from "react";
import {
  Heading,
  Button,
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
  let [sessionData, updateSession, getSession] = [
    props.data,
    props.update,
    props.get
  ];

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
      history.push("/#/dashboard");
    }, 2000);
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
        update={updateSession}
        getter={getSession}
      />
      <PictureSection
        sessionData={sessionData}
        update={updateSession}
        getter={getSession}
      />
      <SurveySection
        sessionData={sessionData}
        update={updateSession}
        getter={getSession}
        viewSwitcher={props.viewSwitcher}
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
