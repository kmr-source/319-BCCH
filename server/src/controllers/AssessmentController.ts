import { AuthController } from "./AuthController";
import { AssessmentTemplateImpl } from "../models/AssessmentTemplate"
import { SurveyTemplateImpl} from "../models/SurveyTemplate"
import { DBConnection } from "../DBConnection";
import { AssessmentTemplate } from "../models/IAssessmentTemplate";

export class AssessmentController extends AuthController {

    getAssessment() {

    }

    getAllAssessments() {

    }

    async getAllSurveys() {
        let db = DBConnection.getInstance();
        let ids = await db.send("SELECT id FROM SurveyTemplate");
        let allIds : number[] = [];
        for (let i of ids) {
            allIds.push(i.id);
        }
        let allSurveys = await SurveyTemplateImpl.getByIds(allIds);
        let result : any[] = [];
        for (let s of allSurveys) {
            let template : any = {};
            template.sTitle = s.name;
            template.sId = s.id;
            template.sInst = s.inst;
            let allQuestion : any[] = [];
            for (let q of s.questions) {
                let sq = {
                qOrder : q.number,
                qDesc : q.statement,
                qType : q.type,
                qOpts : q.meta,
                };
                allQuestion.push(sq);
            }
            template.sContent = allQuestion;
            result.push(template);
        }
        return result;
    }

    async addAssessment() {
        let db = DBConnection.getInstance();
        let ids = await db.send("SELECT id FROM AssessmentTemplate");
        let newId = ids[0].id;
        for (let i of ids) {
            if (i.id > newId) {
                newId = i.id;
            }
        }
        newId++;
        if (this.isAdmin) {
            let assessForm: any = this.request.body;
            let newAssess: AssessmentTemplate = {
                id: newId,
                name: assessForm.title,
                description: assessForm.desc,
                videos: assessForm.videos,
                pictures: assessForm.pictures,
                surveyIDs: assessForm.surveyIDs,
                isArchived: false
            };
            // database transaction here?
            this.response.status(200).send({ id: newAssess.id });
            return;
        }
        else {
            this.response.status(401).send({ error: "Invalid credentials" });
        }
    }

    async archiveAssessment(id: number) {
        let assess = await AssessmentTemplateImpl.getById(id);
        if (assess !== undefined) {
            assess.isArchived = true;
        }
    }


    archiveSurvey() {

    }
}