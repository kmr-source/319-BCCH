import { AssessmentTemplate, AssessmentTitle } from "./IAssessmentTemplate";
import { DBConnection } from "../DBConnection";
import { SurveyTemplate } from "./ISurveyTemplate"
import { SurveyTemplateImpl } from "./SurveyTemplate";

export class AssessmentTemplateImpl implements AssessmentTemplate {
    private _id: number;
    private _name: string;
    private _description: string;
    private _videos: string[];
    private _pictures: string[];
    private _surveyIDs: number[];
    private _isArchived: boolean;

    get id(): number { return this._id; }
    get name(): string { return this._name; }
    get description(): string { return this._description; }
    get videos(): string[] { return this._videos; }
    get pictures(): string[] { return this._pictures; }
    get surveyIDs(): number[] { return this._surveyIDs; }
    get isArchived(): boolean { return this._isArchived; }

    set isArchived(val: boolean) { this._isArchived = val; }

    constructor(
        id: number,
        name: string,
        description: string,
        videos: string[],
        pictures: string[],
        surveyIDs: number[],
        is_archived: boolean
    ) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._videos = videos;
        this._pictures = pictures;
        this._surveyIDs = surveyIDs;
        this._isArchived = is_archived;
    }

    static async getById(assessmentID: number): Promise<AssessmentTemplate | undefined> {
        let db = DBConnection.getInstance();
        let result = await db.send("SELECT * FROM AssessmentTemplate WHERE id=? AND is_archived=0", [assessmentID]);
        let assess = undefined;
        if (result.length !== 0) {
            let assessInfo = result[0];
            let aTitle = assessInfo.name;
            let aDesc = assessInfo.description;
            let aDelete = assessInfo.is_archived;
            let videosDescProm = db.send("SELECT description FROM VideoDescription WHERE temp_id=?", [assessmentID]);
            let picDescProm = db.send("SELECT description FROM PictureDescription WHERE temp_id=?", [assessmentID]);
            let surIdsProm = db.send("SELECT sur_temp_id FROM HasSurvey WHERE assess_temp_id=>", [assessmentID]);
            let promiseRes = await Promise.all([videosDescProm, picDescProm, surIdsProm])
            let videosDesc = promiseRes[0];
            let picDesc = promiseRes[1];
            let surIds = promiseRes[2];

            assess = new AssessmentTemplateImpl(
                assessmentID,
                aTitle,
                aDesc,
                videosDesc,
                picDesc,
                surIds,
                aDelete
            );

            return assess;
        }

        return assess;
    }

    static async getAllTitles(): Promise<AssessmentTitle[]> {
        let db = DBConnection.getInstance();
        let result = await db.send("SELECT id,name FROM AssessmentTemplate");
        return result.map((r: any) => { return { name: r.name, id: r.id } });
    }

    async getAllSurveyTemplates(): Promise<SurveyTemplate[]> {
        let finalResult = await SurveyTemplateImpl.getByIds(this._surveyIDs)
        return finalResult;
    }

    async update(): Promise<boolean> {
        let db = DBConnection.getInstance();
        let arChievedVal = this.isArchived ? 1 : 0;

        await db.send(
            "UPDATE AssessmentTemplate SET is_archived=? WHERE id=?",
            [arChievedVal, this._id]);

        return true;
    }
}