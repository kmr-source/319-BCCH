import React from "react";

// import css
import "../css/DashboardAdmin.scss";

export function DashboardAdmin(props) {
    return (
        <div id="dash-board-admin-container">
            <p style="font-size: 28px;"> Query Data: </p>
            <p style="font-size: 24px;"> Table: </p>
            <div class="select-style">
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
            /*
            User(id, name, age, gender, sex, date_created, is_admin, date_of_birth)
            SessionType(session_type_id, session_type_name, num_videos, num_pics, num_surveys)
            Session(session_id, user_id, session_type_id, is_complete, time_created)
            Video(video_id, session_id, user_id, filename, size, time_created)
            Picture(pic_id, session_id, user_id, filename, size, time_created)
            Survey(sur_id, session_id, user_id, survey_type, num_questions, time_created)
            SurveyQuestion(survey_type, question_num, question_type, statement, mcq)
            SurveyAnswer(sur_id, question_num, survey_type, answer)
            */
            <p style="font-size: 24px;"> Display Columns: </p>
            //Column options dependent on Table selection
            <label class="container">id
                <input type="checkbox"></input>
                <span class="checkmark"></span>
            </label>
            <label class="container">name
                <input type="checkbox"></input>
                <span class="checkmark"></span>
            </label>
            <label class="container">age
                <input type="checkbox"></input>
                <span class="checkmark"></span>
            </label>
            <label class="container">gender
                <input type="checkbox"></input>
                <span class="checkmark"></span>
            </label>
            <label class="container">sex
                <input type="checkbox"></input>
                <span class="checkmark"></span>
            </label>
            <label class="container">date_created
                <input type="checkbox"></input>
                <span class="checkmark"></span>
            </label>
            <label class="container">is_admin
                <input type="checkbox"></input>
                <span class="checkmark"></span>
            </label>
            <label class="container">date_of_birth
                <input type="checkbox"></input>
                <span class="checkmark"></span>
            </label>
            <p style="font-size: 24px;"> Filters: </p>
            //support multiple filters with and/or
            <div class="select-style">
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
            <div class="select-style">
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
            <div class="input-style">
                <input type="text" id="filterbox" name="filterbox"></input>
            </div>
            <br></br>
            <div class="button">
                <a href="#" class="myButton" onclick="alert('Execute Query')">Execute Query</a>
            </div>
        </div>
    );
}