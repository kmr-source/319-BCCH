import React, { useState } from "react";
import { Icon, Badge } from "evergreen-ui";

import "../../css/Upload.scss";

function mediaSectionBuilder(updateInfoObj) {
  let blockDisplayStyle = {
    display: updateInfoObj.requiredNum === 0 ? "none" : "block"
  };

  let titlePicker = {
    video: "Video",
    picture: "Picture"
  };

  let iconPicker = {
    video: "video",
    picture: "graph"
  };

  let uploadPlaceHolder = (
    <div className="upload-item upload-place-holder">
      <div className="upload-item-icon place-holder-icon">
        <Icon icon="upload" size={40} />
      </div>
      <div className="upload-item-text place-holder-text">Upload</div>
    </div>
  );

  let objIcons = updateInfoObj.currentList.map((obj, idx) => {
    return (
      <div
        className="upload-item"
        key={`${updateInfoObj.type}-${idx}`}
        title={obj.name}
      >
        <div className="delete-icon" onClick={deleteItem(updateInfoObj, idx)}>
          <Icon icon="cross" />
        </div>
        <div className="upload-item-icon">
          <Icon icon={iconPicker[updateInfoObj.type]} size={50} />
        </div>
        <div className="upload-item-text">{obj.name}</div>
      </div>
    );
  });

  if (!updateInfoObj.status) {
    objIcons.push(
      <div key={`upload-place-holder-${updateInfoObj.type}`}>
        <input
          type="file"
          name={`${updateInfoObj.type}-upload`}
          id={`${updateInfoObj.type}-upload`}
          className="inputfile-hidden"
          multiple="multiple"
          onChange={uploadHandler(updateInfoObj)}
        />
        <label htmlFor={`${updateInfoObj.type}-upload`}>
          {uploadPlaceHolder}
        </label>
      </div>
    );
  }

  return (
    <div className="section-common" style={blockDisplayStyle}>
      <div className="title-upload-common">
        {titlePicker[updateInfoObj.type]}({updateInfoObj.currentNum}/
        {updateInfoObj.requiredNum})
        {updateInfoObj.status ? (
          <Badge
            color="green"
            marginLeft="10px"
            marginBottom="5px"
            paddingY="6px"
            paddingX="4px"
            height="28px"
            width="70px"
            fontSize="20px"
          >
            DONE
          </Badge>
        ) : (
          ""
        )}
      </div>
      <div className="files-container">{objIcons}</div>
    </div>
  );
}

function deleteItem(updateObj, idx) {
  return () => {
    let newList = updateObj.currentList.filter((v, i) => i !== idx);
    updateObj.sessionUpdater(updateObj.type, newList);
    updateObj.numSetter(newList.length);
    updateObj.listSetter(newList);
    updateObj.statusSetter(false);
  };
}

function uploadHandler(updateInfoObj) {
  return event => {
    let files = updateInfoObj.currentList;
    for (let f of event.target.files) {
      files.push(f);
    }

    files = files.slice(0, updateInfoObj.requiredNum);
    updateInfoObj.sessionUpdater(updateInfoObj.type, files);
    updateInfoObj.numSetter(files.length);
    updateInfoObj.statusSetter(files.length === updateInfoObj.requiredNum);
    updateInfoObj.listSetter(files);
  };
}

export function VideoSection(props) {
  let videoInfo = props.videoRequired;
  let requiredNum = videoInfo.length;

  let [videoNum, setVideoNum] = useState(0);
  let [isComplete, setIsComplete] = useState(videoNum === requiredNum);
  let [videos, setVideos] = useState([]);

  return mediaSectionBuilder({
    type: "video",
    requiredNum: requiredNum,
    currentNum: videoNum,
    currentList: videos,
    status: isComplete,
    numSetter: setVideoNum,
    statusSetter: setIsComplete,
    listSetter: setVideos,
    sessionUpdater: props.update
  });
}

export function PictureSection(props) {
  let picInfo = props.pictureRequired;
  let requiredNum = picInfo.length;

  let [picNUm, setpicNUm] = useState(0);
  let [isComplete, setIsComplete] = useState(picNUm === requiredNum);
  let [pics, setPics] = useState([]);

  return mediaSectionBuilder({
    type: "picture",
    requiredNum: requiredNum,
    currentNum: picNUm,
    currentList: pics,
    status: isComplete,
    numSetter: setpicNUm,
    statusSetter: setIsComplete,
    listSetter: setPics,
    sessionUpdater: props.update
  });
}

export function SurveySection(props) {
  return (
    <div className="section-common">
      <div className="title-upload-common">Survey</div>
      <div className="files-container">//TODO</div>
    </div>
  );
}
