import React, { useState } from "react";
// import queryfile from "../../public/query.csv";

// import css
import "../css/Query.scss";

export function Query() {
  const query = { field: "", oper: "", value: "" };
  const [queryRows, setQueryRows] = useState([{ ...query }]);
  const [result, setResult] = useState({ table: "", columns: [], data: [] });
  const [filterFields, setFilterFields] = useState([]);
  const [outputQuery, setOutputQuery] = useState("");
  const [displayColumns, setDisplayColumns] = useState({});
  const [selectedCols, setSelectedCols] = useState([]);

  const addRow = () => {
    setQueryRows([...queryRows, { ...query }]);
  };

  const handleChange = e => {
    const newRows = [...queryRows];
    newRows[e.target.dataset.idx][e.target.dataset.type] = e.target.value;
    setQueryRows(newRows);
  };

  const removeRow = id => {
    const rowX = [...queryRows];
    rowX.splice(id, 1);
    setQueryRows(rowX);
  };

  const refreshResultTable = e => {
    const tableData = tables[e.target.value];
    setResult({
      table: tableData.table,
      columns: tableData.columns,
      data: tableData.mockData
    });
    const filters = [...tableData.columns];
    filters.unshift("");
    setFilterFields(filters);
    setQueryRows([query]);
    setOutputQuery("");
    const displayCols = { selectAll: false };
    tableData.columns.forEach(col => {
      displayCols[col] = false;
    });
    setDisplayColumns(displayCols);
    setSelectedCols([]);
  };

  const executeQuery = () => {
    let selected =
      selectedCols.length === Object.keys(displayColumns).length - 1
        ? "*"
        : selectedCols.join(", ");
    let query = buildQuery(queryRows, result.table, selected);
    setOutputQuery(query);
  };

  const displayColumnChecked = e => {
    const dc = { ...displayColumns };
    if (e.target.value === "selectAll") {
      let original = dc[e.target.value];
      Object.keys(dc).forEach(key => {
        dc[key] = !original;
      });
    } else {
      dc[e.target.value] = !dc[e.target.value];
    }
    if (!dc[e.target.value]) dc["selectAll"] = false;
    const selected = [];
    Object.keys(dc).forEach(key => {
      if (dc[key]) selected.push(key);
    });
    if (selected.length === Object.keys(dc).length - 1) dc["selectAll"] = true;
    if (selected.includes("selectAll")) selected.shift();
    setSelectedCols(selected);
    setDisplayColumns(dc);
  };

  return (
    <div id="query-container">
      <p style={{ fontSize: 28 }}> Query Data: </p>
      <p style={{ fontSize: 24 }}> Table: </p>
      <div className="select-style">
        <select onChange={refreshResultTable}>
          <option value=""></option>
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
      <p style={{ fontSize: 24 }}> Display Columns: </p>
      <br></br>
      {Object.keys(displayColumns).map((item, index) => (
        <label key={index} className="container">
          {item}
          <input
            type="checkbox"
            value={item}
            checked={displayColumns[item]}
            onChange={displayColumnChecked}
          />
          <span className="checkmark" />
        </label>
      ))}
      <p style={{ fontSize: 24 }}> Filters: </p>
      //support multiple filters with and/or
      <br></br>
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
                {queryRows.map((item, idx) => {
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
                          value={queryRows[idx].field}
                          data-idx={idx}
                          onChange={handleChange}
                          data-type={"field"}
                          className="text-center"
                        >
                          {filterFields.map((filter, i) => (
                            <option
                              key={i}
                              value={filter}
                              className="text-center"
                            >
                              {filter}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          id={operID}
                          name={operID}
                          value={queryRows[idx].oper}
                          data-idx={idx}
                          onChange={handleChange}
                          data-type={"oper"}
                          className="text-center"
                        >
                          <option value=""></option>
                          <option value="=">=</option>
                          <option value="!=">!=</option>
                          <option value=">">&gt;</option>
                          <option value="<">&lt;</option>
                          <option value=">=">&gt;=</option>
                          <option value="<=">&lt;=</option>
                          <option value="is">IS</option>
                        </select>
                      </td>
                      <td>
                        <input
                          id={valueID}
                          type="text"
                          name={valueID}
                          value={queryRows[idx].value}
                          data-idx={idx}
                          onChange={handleChange}
                          data-type={"value"}
                          className="text-center"
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
              Add Filter
            </button>
            <button
              onClick={() => {
                executeQuery();
              }}
              className="btn btn-danger float-right"
            >
              Execute Query
            </button>
            <div className="btn btn-danger float-right">
              <a href={"queryfile"} download style={{ color: "#ffffff" }}>
                Export Query
              </a>
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <div>{outputQuery}</div>
      <br></br>
      <div className="container">
        <div className="row clearfix">
          <div className="col-md-12 column">
            <table
              className="table table-bordered table-hover"
              id="result-table"
            >
              <thead>
                <tr>
                  {result.columns.map((item, index) => (
                    <th key={index} className="text-center">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.map((item, index) => (
                  <tr key={index}>
                    {item.map((datum, i) => (
                      <td key={i} className="text-center">
                        {datum}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildQuery(filters, table, selectedCols) {
  const conditions = [];
  let query = `SELECT ${selectedCols} FROM ${table} WHERE `;
  filters.forEach(filter => {
    const field = filter.field;
    const oper = filter.oper;
    const value = filter.value;
    if (field === "" || oper === "") return;
    conditions.push(`${field} ${oper} "${value}"`);
  });
  return conditions.length === 0 ? "" : query + conditions.join(" and ");
}

const tables = {
  user: {
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
  sessiontype: {
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
  session: {
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
  video: {
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
  picture: {
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
  survey: {
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
  surveyquestion: {
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
  surveyanswer: {
    table: "SurveyAnswer",
    columns: ["sur_id", "question_num", "survey_type", "answer"],
    mockData: [
      ["1", "1", "textinput", "no pain, feel great"],
      ["2", "1", "textinput", "rough sleep, woke up several times"],
      ["3", "1", "textinput", "early morning, felt energized"],
      ["4", "1", "textinput", "sleepy after 6pm, took a nap"]
    ]
  }
};
