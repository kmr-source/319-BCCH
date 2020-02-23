import React, { useState } from "react";
import {
  Text,
  Textarea,
  Heading,
  Paragraph,
  TextInput,
  Dialog
} from "evergreen-ui";

import "../../css/Upload.scss";
import "../../css/Survey.scss";

function InputGroup(props) {
  let question = props.que;
  let answer = props.ans;
  let [range, setRange] = useState(question.qOpts.min);
  return (
    <div>
      <Text size={500} marginRight="5px">
        {question.qOpts.min}
      </Text>
      <input
        className="range-input"
        type="range"
        min={question.qOpts.min}
        step="1"
        value={range}
        onChange={e => {
          answer(e);
          setRange(e.target.value);
        }}
        max={question.qOpts.max}
      />
      <Text size={500} marginLeft="5px">
        {question.qOpts.max}
      </Text>
    </div>
  );
}

function buildQuestion(question, setAnswer) {
  let tpe = question.qType;

  let answer = e => {
    setAnswer(question.qOrder, e.target.value);
  };

  let descriptionField = (
    <div>
      <Paragraph size={500} marginTop="10px">
        {question.qOrder}. {question.qDesc}
      </Paragraph>
    </div>
  );

  let answerField = "";
  if (tpe === "fill") {
    answerField = <TextInput onChange={answer} />;
  } else if (tpe === "multiple") {
    answerField = "";
  } else if (tpe === "fillPara") {
    answerField = (
      <Textarea onChange={answer} grammarly={true} spellCheck={true} />
    );
  } else if (tpe === "scale") {
    answerField = <InputGroup que={question} ans={answer} />;
  }

  return (
    <div className="survey-question">
      <div className="question-desc-section">{descriptionField}</div>
      <div className="answer-section">{answerField}</div>
    </div>
  );
}

export function SurveyPortal(props) {
  if (!props.currentSurvey) {
    return <div></div>;
  }

  let [quitDialogIsShown, setQuitDialogIsShown] = useState();
  let surveyParams = props.surveyParams;
  let surveyList = props.data.surveys;
  let [theSurvey, exitFunc] = [
    surveyList.find(s => s.sId === props.currentSurvey),
    props.viewSwitcher
  ];
  let answer = {};

  //debug
  window.debugS = answer;

  let setAnswer = (key, ans) => {
    answer[key] = ans;
  };

  function saveSurvey() {
    return () => {
      for (let q of theSurvey.sContent) {
        if (!answer[q.qOrder]) {
          answer[q.qOrder] = "";
        }
      }

      let originalAns = props.get("survey");
      originalAns.push({ sId: theSurvey.sId, answers: answer });
      surveyParams.listSetter(originalAns);
      surveyParams.numSetter(originalAns.length);
      surveyParams.statusSetter(
        originalAns.length === surveyParams.requiredNum
      );
      props.update("survey", originalAns);
      exitFunc()();
    };
  }

  return (
    <div id="survey-portal-container">
      <div id="survey-title-container">
        <Heading size={700} marginTop="20px">
          {theSurvey.sTitle}
        </Heading>
      </div>
      <div id="instruction-field">
        <Paragraph size={500} fontWeight={500} marginTop="default">
          {theSurvey.sInst}
        </Paragraph>
      </div>
      <div id="question-container">
        {theSurvey.sContent.map(q => buildQuestion(q, setAnswer))}
      </div>
      <div className="submit-button-group">
        <div className="primary-button" onClick={saveSurvey()}>
          Save
        </div>
        <div
          className="cancel-button"
          onClick={() => {
            setQuitDialogIsShown(true);
          }}
        >
          Cancel
        </div>
      </div>

      <Dialog
        isShown={quitDialogIsShown}
        onConfirm={exitFunc()}
        confirmLabel="Quit"
        preventBodyScrolling
        cancelLabel="Cancel"
        onCloseComplete={() => setQuitDialogIsShown(false)}
        title="Quit Confirmation"
        intent="warning"
      >
        Do you want to leave the survey? All changes will not be saved.
      </Dialog>
    </div>
  );
}
