import { AuthController } from "./AuthController";
import { AssessmentTemplate, AssessmentTitle } from "../models/IAssessmentTemplate";
import { AssessmentTemplateImpl } from "../models/AssessmentTemplate";
import { DBConnection } from "../DBConnection";


export class AssessmentController extends AuthController {

    async getAssessment (t: number|string) {
    
        let db = DBConnection.getInstance(); 
        let res = null;
        if (t === "string") {
            res = await db.send("Select From AssessmentTemplace WHERE id=? AND is_archived=1",[t]);
        } else {
            res = await db.send("Select From AssesmentTemplate WHERE title=? ANd is_isarchived=1",[t]);
        }
        let info = res.body;
        // set up wanted for assesment.
        let assessmentForm = {
            title: info.name,
            id: info.id,
            desc: info.desc,
            vidoes:info.vidoes,
            pictures: info.pictures,
            surveys: info.surveys,
        
        };
        this.response.status(200).send(assessmentForm);
        return; 
    }

    // just send all AssesmentTemplates name and ID
    async getAllAssessments(): Promise<AssessmentTitle[]> {
     let db = DBConnection.getInstance(); 
    }

    getAllSurveys() {

    }

    // parse body from request, 
    // create new assessment + add to database
    addAssessment() {

    }

    archiveAssessment() {

    }

    // flip isarchived field in survery
    archiveSurvey() {

    }
}