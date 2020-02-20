import React, { useState, useEffect } from "react";
import {
  Icon,
  Badge,
  Tooltip,
  UnorderedList,
  ListItem,
  Position
} from "evergreen-ui";

import "../../css/Upload.scss";

function buildMediaSection(updateInfoObj) {
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

  return buildCommonSection(
    updateInfoObj,
    titlePicker[updateInfoObj.type],
    objIcons,
    blockDisplayStyle
  );
}

function buildSurveySection(updateInfoObj) {
  let blockDisplayStyle = {
    display: updateInfoObj.requiredNum === 0 ? "none" : "block"
  };

  let surveyIcons = updateInfoObj.surveyInfo.map((survey, idx) => {
    let allAnswers = updateInfoObj.sessionGetter("survey");
    let answer = allAnswers.find(a => a.sId === survey.sId);
    if (answer) {
      return (
        <div
          className="upload-item"
          title={survey.sTitle}
          key={`survey-${survey.sId}`}
          onClick={updateInfoObj.viewSwitcher(survey.sId, updateInfoObj)}
        >
          <div className="upload-item-icon survey-done-icon">
            <Icon icon="confirm" size={50} />
          </div>
          <div className="upload-item-text">{survey.sTitle}</div>
        </div>
      );
    } else {
      return (
        <div
          className="upload-item upload-item-survey"
          title={survey.sTitle}
          key={`survey-${survey.sId}`}
          onClick={updateInfoObj.viewSwitcher(survey.sId, updateInfoObj)}
        >
          <div className="upload-item-icon">
            <Icon icon="annotation" size={50} />
          </div>
          <div className="upload-item-text">{survey.sTitle}</div>
        </div>
      );
    }
  });

  return buildCommonSection(
    updateInfoObj,
    "Survey",
    surveyIcons,
    blockDisplayStyle
  );
}

function buildCommonSection(updateInfoObj, title, items, blockDisplayStyle) {
  return (
    <div className="section-common" style={blockDisplayStyle}>
      <div className="title-upload-common">
        {title}({updateInfoObj.currentNum}/{updateInfoObj.requiredNum})
        <Tooltip
          content={makeUploadSectionDescription(
            updateInfoObj.descList,
            updateInfoObj.type
          )}
          position={Position.RIGHT}
        >
          <Icon icon="info-sign" marginLeft="10px" />
        </Tooltip>
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
      <div className="files-container">{items}</div>
    </div>
  );
}

function makeUploadSectionDescription(descList, type) {
  let descComps = descList.map((desc, idx) => {
    return (
      <ListItem key={`${type}-desc-${idx}`} color="white">
        {desc}
      </ListItem>
    );
  });

  return (
    <UnorderedList key={`${type}-unordered-desc`} paddingX="10px">
      {descComps}
    </UnorderedList>
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
  let videoInfo = props.sessionData.videos;
  let requiredNum = videoInfo.length;

  let [videoNum, setVideoNum] = useState(0);
  let [isComplete, setIsComplete] = useState(false);
  let [videos, setVideos] = useState([]);

  return buildMediaSection({
    type: "video",
    descList: videoInfo,
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
  let picInfo = props.sessionData.pictures;
  let requiredNum = picInfo.length;

  let [picNUm, setpicNUm] = useState(0);
  let [isComplete, setIsComplete] = useState(false);
  let [pics, setPics] = useState([]);

  return buildMediaSection({
    type: "picture",
    descList: picInfo,
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
  let surInfo = props.sessionData.surveys;
  let [surveyNum, setSurveyNum] = useState(0);
  let [isComplete, setIsComplete] = useState(false);
  let [surveys, setSurveys] = useState([]);

  return buildSurveySection({
    viewSwitcher: props.viewSwitcher,
    requiredNum: surInfo.length,
    descList: surInfo.map(s => s.sTitle),
    surveyInfo: surInfo,
    currentNum: surveyNum,
    currentList: surveys,
    status: isComplete,
    numSetter: setSurveyNum,
    statusSetter: setIsComplete,
    listSetter: setSurveys,
    sessionUpdater: props.update,
    sessionGetter: props.getter
  });
}
