import { SurveyTemplate, SurveyQuestion } from "./ISurveyTemplate";
import * as mysql from "mysql";
import { DBConnection } from "../DBConnection";

export class SurveyTemplateImpl implements SurveyTemplate {
    private _id: number;
    private _name: string;
    private _inst: string;
    private _isArchived: boolean;
    private _questions: SurveyQuestion[];

    get id(): number { return this._id; }
    get name(): string { return this._name; }
    get inst(): string { return this._inst; }
    get isArchived(): boolean { return this._isArchived; }
    get questions(): SurveyQuestion[] { return this._questions; }

    constructor(
        id: number,
        name: string,
        inst: string,
        isArchived: boolean,
        questions: SurveyQuestion[]
    ) {
        this._id = id;
        this._name = name;
        this._inst = inst;
        this._isArchived = isArchived;
        this._questions = questions;
    }

    private static async getAllQuestions(ids: number[]): Promise<Map<number ,SurveyQuestion[]>> {
        let db = DBConnection.getInstance();
        let query = "SELECT * FROM SurveyQuestion WHERE temp_id=" + mysql.escape(ids[0]);
        for (let i = 1; i < ids.length; i++) {
            query += " OR temp_id=" + mysql.escape(ids[i]);
        }
        query += " ORDER BY temp_id, q_number";
        let allQuestions = await db.send(query);

        let finalResult = new Map();
        for (let rec of allQuestions) {
            let ques: SurveyQuestion[] = finalResult.get(rec.temp_id);
            if (!ques) {
                ques = [];
            }
            ques.push(rec);
            finalResult.set(rec.temp_id, ques);
        }

        return finalResult;
    }

    static async getByIds(ids: number[]): Promise<SurveyTemplate[]> {
        let db = DBConnection.getInstance();
        let query = "SELECT * FROM SurveyTemplate WHERE id=" + mysql.escape(ids[0]);
        for (let i = 1; i < ids.length; i++) {
            query += " OR id=" + mysql.escape(ids[i]);
        }
        let allSurveys = await db.send(query);
        let allQuestions: Map<number, SurveyQuestion[]> = await SurveyTemplateImpl.getAllQuestions(ids);

        let result = [];
        for (let s of allSurveys) {
            let allQues: SurveyQuestion[] = allQuestions.get(s.id);
            result.push(
                new SurveyTemplateImpl(
                    s.id,
                    s.name,
                    s.instruction,
                    s.is_archived,
                    allQues
                ));
        }

        return result;
    }
}