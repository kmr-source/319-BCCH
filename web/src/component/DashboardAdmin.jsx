import React, { useState } from "react";
// import queryfile from "../../public/query.csv";

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
  const tables = [
    {
      table: "User",
      columns: [
        "id",
        "name",
        "age",
        "gender",
        "sex",
        "date_created",
        "is_admin",
        "date_of_birth"
      ],
      mockData: [
        ["1", "John Smith", "53", "M", "M", "2020/02/02", "F", "1998/04/12"],
        ["2", "Jane Smith", "15", "F", "F", "2020/02/02", "F", "1956/01/03"],
        ["3", "John Doe", "35", "M", "M", "2020/02/02", "T", "2008/12/12"],
        ["4", "Jane Doe", "43", "F", "F", "2020/02/02", "T", "1977/07/07"]
      ]
    },
    {
      table: "SessionType",
      columns: [
        "session_type_id",
        "session_type_name",
        "num_videos",
        "num_pics",
        "num_surveys"
      ],
      mockData: [
        ["1", "Type A", "1", "1", "1"],
        ["2", "Type B", "3", "1", "1"],
        ["3", "Type C", "0", "2", "1"],
        ["4", "Type D", "2", "1", "1"]
      ]
    },
    {
      table: "Session",
      columns: [
        "session_id",
        "user_id",
        "session_type_id",
        "is_complete",
        "time_created"
      ],
      mockData: [
        ["1", "1", "1", "T", "2020/01/01 7:59pm"],
        ["2", "2", "2", "T", "2020/02/02 3:33am"],
        ["3", "3", "3", "T", "2020/02/04 4:15pm"],
        ["4", "4", "4", "T", "2020/02/18 2:22pm"]
      ]
    },
    {
      table: "Video",
      columns: [
        "video_id",
        "session_id",
        "user_id",
        "filename",
        "size",
        "time_created"
      ],
      mockData: [
        ["1", "1", "1", "1-1-1.mov", "100mb", "2020/01/01 7:59pm"],
        ["2", "2", "2", "2-2-2.mov", "275mb", "2020/02/02 3:33am"],
        ["3", "2", "2", "3-2-2.mov", "1000mb", "2020/02/02 3:33am"],
        ["4", "2", "2", "4-2-2.mov", "1003mb", "2020/02/02 3:33am"],
        ["5", "4", "4", "5-4-4.mov", "1026mb", "2020/02/18 2:22pm"],
        ["6", "4", "4", "6-4-4.mov", "1777mb", "2020/02/18 2:22pm"]
      ]
    },
    {
      table: "Picture",
      columns: [
        "pic_id",
        "session_id",
        "user_id",
        "filename",
        "size",
        "time_created"
      ],
      mockData: [
        ["1", "1", "1", "1-1-1.jpg", "1004mb", "2020/01/01 7:59pm"],
        ["2", "2", "2", "2-2-2.jpg", "2725mb", "2020/02/02 3:33am"],
        ["3", "3", "3", "3-3-3.jpg", "1330mb", "2020/02/04 4:15pm"],
        ["4", "3", "3", "4-3-3.jpg", "1043mb", "2020/02/04 4:15pm"],
        ["5", "4", "4", "5-4-4.jpg", "1856mb", "2020/02/18 2:22pm"]
      ]
    },
    {
      table: "Survey",
      columns: [
        "sur_id",
        "session_id",
        "user_id",
        "survey_type",
        "num_questions",
        "time_created"
      ],
      mockData: [
        ["1", "1", "1", "Type A", "1", "2020/01/01 7:59pm"],
        ["2", "2", "2", "Type B", "1", "2020/02/02 3:33am"],
        ["3", "3", "3", "Type C", "1", "2020/02/04 4:15pm"],
        ["4", "4", "4", "Type D", "1", "2020/02/18 2:22pm"]
      ]
    },
    {
      table: "SurveyQuestion",
      columns: [
        "survey_type",
        "question_num",
        "question_type",
        "statement",
        "mcq"
      ],
      mockData: [
        ["Type A", "1", "textinput", "Describe your pain.", "F"],
        ["Type B", "1", "textinput", "Describe your sleep", "F"],
        ["Type C", "1", "textinput", "Describe your morning", "F"],
        ["Type D", "1", "textinput", "Describe your evening", "F"]
      ]
    },
    {
      table: "SurveyAnswer",
      columns: ["sur_id", "question_num", "survey_type", "answer"],
      mockData: [
        ["1", "1", "textinput", "no pain, feel great"],
        ["2", "1", "textinput", "rough sleep, woke up several times"],
        ["3", "1", "textinput", "early morning, felt energized"],
        ["4", "1", "textinput", "sleepy after 6pm, took a nap"]
      ]
    }
  ];
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
