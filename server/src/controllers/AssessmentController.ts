import { AuthController } from "./AuthController";
import { AssessmentTemplateImpl } from "../models/AssessmentTemplate"
import { SurveyTemplateImpl } from "../models/SurveyTemplate"
import { QuestionType, SurveyQuestion } from "../models/ISurveyTemplate";

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

    private toType(t: QuestionTypeTransfer) {
        switch (t) {
            case QuestionTypeTransfer.SCALE:
                return QuestionType.SCALE;
            case QuestionTypeTransfer.FILL:
                return QuestionType.FILL;
            case QuestionTypeTransfer.FILL_PARA:
                return QuestionType.LARGE_TEXT;
            case QuestionTypeTransfer.FILL_TIME:
                return QuestionType.FILL_TIME;
            case QuestionTypeTransfer.MULTIPLE:
                return QuestionType.MULTIPLE_CHOICE;
        }
    }

    async addSurvey() {
        if (this.isAdmin) {
            let survey: SurveyTransfer = this.request.body;
            let questions: SurveyQuestion[] = [];

            for (let q of survey.sContent) {
                questions.push({
                    number: q.qOrder,
                    type: this.toType(q.qType),
                    statement: q.qDesc,
                    meta: q.qOpts
                });
            }

            let id = await new SurveyTemplateImpl(
                undefined,
                survey.sTitle,
                survey.sInst,
                questions
            ).store();

            this.response.status(200).send({ id: id });
        } else {
            this.response.status(401).send({ error: "Invalid credentials" });
        }
    }
}

enum QuestionTypeTransfer {
    SCALE = "scale",
    FILL = "fill",
    FILL_TIME = "fill_time",
    MULTIPLE = "multiple",
    FILL_PARA = "fillPara"
}

interface QuestionTransfer {
    qOrder: number,
    qDesc: string,
    qOpts: any,
    qType: QuestionTypeTransfer
}

interface SurveyTransfer {
    sTitle: string,
    sInst: string,
    sContent: QuestionTransfer[]
}
