import { AuthController } from "./AuthController";
import { AssessmentTemplateImpl } from "../models/AssessmentTemplate"
import { SurveyTemplateImpl } from "../models/SurveyTemplate"

export class AssessmentController extends AuthController {

    getAssessment() {

    }

    getAllAssessments() {

    }

    async getAllSurveys() {
        try {
            let allSurveys = await SurveyTemplateImpl.getAll();
            let result: any[] = [];
            for (let s of allSurveys) {
                let template: any = {};
                template.sTitle = s.name;
                template.sId = s.id;
                template.sInst = s.inst;
                let allQuestion: any[] = [];
                for (let q of s.questions) {
                    let sq = {
                        qOrder: q.number,
                        qDesc: q.statement,
                        qType: q.type,
                        qOpts: q.meta,
                    };
                    allQuestion.push(sq);
                }
                template.sContent = allQuestion;
                result.push(template);
            }

            this.response.send(result);
        } catch (e) {
            this.response.status(500).send("something goes wrong");
        }
    }

    async addAssessment() {
        if (this.isAdmin) {
            let assessForm: any = this.request.body;
            let newAssess = new AssessmentTemplateImpl(
                undefined,
                assessForm.title,
                assessForm.desc,
                assessForm.videos,
                assessForm.pictures,
                assessForm.surveyIDs,
                false
            );
            try {
                let newID = await newAssess.store();
                this.response.status(200).send({ id: newID });
            } catch (e) {
                this.response.status(500).send("something goes wrong");
            }
        } else {
            this.response.status(401).send({ error: "Invalid credentials" });
        }
    }

    async archiveAssessment() {
        if (this.isAdmin) {
            try {
                let id = parseInt(this.request.params.type);
                let res = await AssessmentTemplateImpl.update(id, true);
                this.response.status(200).send({ status: res });
            } catch (e) {
                this.response.status(500).send("something goes wrong");
            }
        } else {
            this.response.status(401).send({ error: "Invalid credentials" });
        }
    }
}