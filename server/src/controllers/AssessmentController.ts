import { AuthController } from "./AuthController";
import { AssessmentTemplate, AssessmentTitle } from "../models/IAssessmentTemplate";
import { AssessmentTemplateImpl } from "../models/AssessmentTemplate";
import { DBConnection } from "../DBConnection";
import { rejects } from "assert";

export class AssessmentController extends AuthController {

    async getAssessment(t: any): Promise<AssessmentTemplate>{
        // read type parameter from Request and send te corresponding assemsent to client
        // getting it from db by ID or smt, the sent it to client, 
        let result = AssessmentTemplateImpl.getById(t).then((read) => {
          return read;
        });
        
        return result; 
    }

    // just send all AssesmentTemplates name and ID
    async getAllAssessments(): Promise<AssessmentTitle[]> {
     
        let r = await AssessmentTemplateImpl.getAllTitles().then((result) => {
            return result;
        });
        return r; 
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