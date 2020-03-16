import { AuthController } from "./AuthController";
import { DBConnection } from "../DBConnection";
import { SurveyTemplate } from "../models/ISurveyTemplate";
import { AssessmentTemplate } from "../models/IAssessmentTemplate";

export class AssessmentController extends AuthController {

    async getAssessment (t: number|string) {
    
        let db = DBConnection.getInstance(); 
        let res = null;
        if (t !== "string") {
            res = await db.send("Select From AssessmentTemplace WHERE id=? AND is_archived=1",[t]);
        } else {
            res = await db.send("Select From AssesmentTemplate WHERE title=? ANd is_isarchived=1",[t]);
        }
        if (res.length !== 0) {
            let info = res[0];

            let atitle = info.name;
            let idName = info.id;
            let tempAssessWithOnlySurveyIDs = await AssessmentTemplateImpl.getById(idName);
            
            let descp = tempAssessWithOnlySurveyIDs.description;
            let videoDesc = tempAssessWithOnlySurveyIDs.videos;
            let picturesDesc = tempAssessWithOnlySurveyIDs.pictures;
           
            let surveyIDs = tempAssessWithOnlySurveyIDs.surveyIDs;
            let surveyInfos = await SurveyTemplateImpl.getByIds(surveyIDs);
            let surveyResults: any[] = [];
            for (let i of surveyInfos) {
                let template: any = {};
                template.Title = i.name;
                template.sId = i.id;
                template.sInst = i.inst;
                let allQuestion : any[] = [];
                for (let q of i.questions) {
                    let surveyQues = {
                    qOrder : q.number,
                    qDesc : q.statement,
                    qType : q.type,
                    qOpts : q.meta,
                    };
                    allQuestion.push(surveyQues);
                }
                template.sContent = allQuestion;
                surveyResults.push(template);
            }
            let assessmentForm = {
                title: atitle,
                id: idName,
                desc: descp,
                vidoes: videoDesc,
                pictures: picturesDesc,
                surveys: surveyResults,
            
            };
            return this.response.status(200).send(assessmentForm);
        }
        return this.response.status(400).send( {error: "Invalid input"});
    }
    // just send all AssesmentTemplates name and ID
    // just send all AssesmentTemplates name and ID
    async getAllAssessments() { 
        let db = DBConnection.getInstance();

        let req =  await db.send("SELECT From AssessmentTemplate id =?");
        if (req.length !== 0) {
            let arr: any  = [];
            let info = req[0];

            for (let i of info) {
                
                let resultObj = {
                   name: i.name,
                   title: i.title,
                }
                arr.push(resultObj);
            }
           return this.response.status(200).send(JSON.stringify(arr));
        }
        return this.response.status(400).send( {error: "Something has gone wrong, please try again"} )
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
            return this.response.status(200).send({id: newSurvey.id})
        } 
            
        return this.response.status(400).send({error: "Invalid credentials"})
        
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