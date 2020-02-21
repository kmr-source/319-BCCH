import React, { useState } from "react";
import queryfile from "../../public/query.csv";

// import css
import "../css/DashboardAdmin.scss";

export function DashboardAdmin(props) {
  const query = { field: "", oper: "", value: "" };
  const [rows, setRows] = useState([{ ...query }]);

  const addRow = () => {
    setRows([...rows, { ...query }]);
  };

  const handleChange = e => {
    const newRows = [...rows];
    newRows[e.target.dataset.idx][e.target.className] = e.target.value;
    setRows(newRows);
  };

  const removeRow = id => {
    const rowX = [...rows];
    rowX.splice(id, 1);
    setRows(rowX);
  };

  return (
    <div id="dash-board-admin-container">
      <p style={{ fontSize: 28 }}> Query Data: </p>
      <p style={{ fontSize: 24 }}> Table: </p>
      <div className="select-style">
        <select>
          <option value="unselected"></option>
          <option value="user">User</option>
          <option value="sessiontype">SessionType</option>
          <option value="session">Session</option>
          <option value="video">Video</option>
          <option value="picture">Picture</option>
          <option value="survey">Survey</option>
          <option value="surveyquestion">SurveyQuestion</option>
          <option value="surveyanswer">SurveyAnswer</option>
        </select>
      </div>
      <br></br>
      /* User(id, name, age, gender, sex, date_created, is_admin, date_of_birth)
      SessionType(session_type_id, session_type_name, num_videos, num_pics,
      num_surveys) Session(session_id, user_id, session_type_id, is_complete,
      time_created) Video(video_id, session_id, user_id, filename, size,
      time_created) Picture(pic_id, session_id, user_id, filename, size,
      time_created) Survey(sur_id, session_id, user_id, survey_type,
      num_questions, time_created) SurveyQuestion(survey_type, question_num,
      question_type, statement, mcq) SurveyAnswer(sur_id, question_num,
      survey_type, answer) */
      <p style={{ fontSize: 24 }}> Display Columns: </p>
      //Column options dependent on Table selection
      <label className="container">
        id
        <input type="checkbox"></input>
        <span className="checkmark"></span>
      </label>
      <label className="container">
        name
        <input type="checkbox"></input>
        <span className="checkmark"></span>
      </label>
      <label className="container">
        age
        <input type="checkbox"></input>
        <span className="checkmark"></span>
      </label>
      <label className="container">
        gender
        <input type="checkbox"></input>
        <span className="checkmark"></span>
      </label>
      <label className="container">
        sex
        <input type="checkbox"></input>
        <span className="checkmark"></span>
      </label>
      <label className="container">
        date_created
        <input type="checkbox"></input>
        <span className="checkmark"></span>
      </label>
      <label className="container">
        is_admin
        <input type="checkbox"></input>
        <span className="checkmark"></span>
      </label>
      <label className="container">
        date_of_birth
        <input type="checkbox"></input>
        <span className="checkmark"></span>
      </label>
      <p style={{ fontSize: 24 }}> Filters: </p>
      //support multiple filters with and/or
      <br></br>
      <div className="select-style">
        <select>
          <option value="unselected"></option>
          <option value="id">id</option>
          <option value="name">name</option>
          <option value="age">age</option>
          <option value="gender">gender</option>
          <option value="sex">sex</option>
          <option value="date_created">date_created</option>
          <option value="is_admin">is_admin</option>
          <option value="date_of_birth">date_of_birth</option>
        </select>
      </div>
      <div className="select-style">
        <select>
          <option value="unselected"></option>
          <option value="equal">=</option>
          <option value="notequal">!=</option>
          <option value="greaterthan">&gt;</option>
          <option value="lessthan">&lt;</option>
          <option value="greaterthaninc">&gt;=</option>
          <option value="lessthaninc">&lt;=</option>
          <option value="is">IS</option>
        </select>
      </div>
      <div className="input-style">
        <input type="text" id="filterbox" name="filterbox"></input>
      </div>
      <div className="container">
        <div className="row clearfix">
          <div className="col-md-12 column">
            <table className="table table-bordered table-hover" id="tab_logic">
              <thead>
                <tr>
                  <th className="text-center"> </th>
                  <th className="text-center"> Field </th>
                  <th className="text-center"> Operator </th>
                  <th className="text-center"> Value </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((item, idx) => {
                  const fieldID = "field_" + idx;
                  const operID = "oper_" + idx;
                  const valueID = "value_" + idx;
                  return (
                    <tr id="addr0" key={idx}>
                      <td></td>
                      <td>
                        <select
                          id={fieldID}
                          name={fieldID}
                          value={rows[idx].field}
                          data-idx={idx}
                          onChange={handleChange}
                          className="field"
                        >
                          <option value="unselected"></option>
                          <option value="id">id</option>
                          <option value="name">name</option>
                          <option value="age">age</option>
                          <option value="gender">gender</option>
                          <option value="sex">sex</option>
                          <option value="date_created">date_created</option>
                          <option value="is_admin">is_admin</option>
                          <option value="date_of_birth">date_of_birth</option>
                        </select>
                      </td>
                      <td>
                        <select
                          id={operID}
                          name={operID}
                          value={rows[idx].oper}
                          data-idx={idx}
                          onChange={handleChange}
                          className="oper"
                        >
                          <option value="unselected"></option>
                          <option value="equal">=</option>
                          <option value="notequal">!=</option>
                          <option value="greaterthan">&gt;</option>
                          <option value="lessthan">&lt;</option>
                          <option value="greaterthaninc">&gt;=</option>
                          <option value="lessthaninc">&lt;=</option>
                          <option value="is">IS</option>
                        </select>
                      </td>
                      <td>
                        <input
                          id={valueID}
                          type="text"
                          name={valueID}
                          value={rows[idx].value}
                          data-idx={idx}
                          onChange={handleChange}
                          className="value"
                          style={{ height: 28, width: 150, opacity: 1 }}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            removeRow(idx);
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button
              onClick={() => {
                addRow();
              }}
              className="btn btn-primary"
            >
              Add Row
            </button>
            <button
              onClick={() => {
                outputQuery();
              }}
              className="btn btn-danger float-right"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <br></br>
      <div className="execute-button">
        <a href="#" onClick={() => alert("Execute Query")}>
          Execute Query
        </a>
      </div>
      <div className="export-button">
        <a href={"queryfile"} download>
          Export Query
        </a>
      </div>
    </div>
  );
}
