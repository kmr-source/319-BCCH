import { AuthController } from "./AuthController";
import { DBConnection } from "../DBConnection";
import { SurveyTemplate } from "../models/ISurveyTemplate";
import { AssessmentTemplate } from "../models/IAssessmentTemplate";

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
    async getAllAssessments() { 
        let db = DBConnection.getInstance();

        let req =  await db.send("SELECT From AssessmentTemplate id =?");
        let arr = [];
        let x = {};
        for (let i of req) {
            x = {
               name: i.name, 
               id: i.id, 
            };
            arr.push(x);
        }
        
        this.response.status(200).send(arr);
        return;

    }

    async addSurvey() {
        let db = DBConnection.getInstance();
        let idList = await db.send("Select id From SurveyTemplate");
        let currID: number = idList[0].id;
        for (let i of idList) {
            if (i.id > currID) {
                currID = i.id;
            }
        }
        currID ++; 
        if (this.isAdmin) {
            let forum = this.request.body;
            let newSurvey: SurveyTemplate = {
                id: currID,
                name: forum.name,
                inst: forum.inst,
                isArchived: forum.isArchived,
                questions: forum.questions,

            };
            this.response.status(200).send({id: newSurvey.id})
        } else {
            this.response.status(400).send({error: "Invalid credentials"})
        }
    
    }


    getAllSurveys() {

    }

    // parse body from request, 
    // create new assessment + add to database
   async addAssessment() {


    }

    archiveAssessment() {

    }

    // flip isarchived field in survery
    archiveSurvey() {

    }
}