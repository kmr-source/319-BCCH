import { AuthController } from "./AuthController";
import { AssessmentTemplateImpl } from "../models/AssessmentTemplate"
import { SurveyTemplateImpl } from "../models/SurveyTemplate"
import { QuestionType, SurveyQuestion } from "../models/ISurveyTemplate";
import {DBConnection} from "../DBConnection";

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
