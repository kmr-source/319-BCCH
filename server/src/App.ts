import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
import { DBConnection, DBConfig } from "./DBConnection";
import { LoginController } from "./controllers/LoginController";
import { AssessmentController } from "./controllers/AssessmentController";
import { Controller } from "./controllers/Controller";
import { AppGlobals } from "./AppGlobals";
import { InMemorySessionManager } from "./services/InMemorySessionManager";
import { UploadController } from "./controllers/UploadController";

const port = process.env.PORT || 3000;
let server = express();

// setup database
let dbConfigJson = fs.readFileSync(path.resolve(__dirname, "../../db-conf.json"));
let dbConfig: DBConfig = JSON.parse(dbConfigJson.toString());
DBConnection.updateConfig(dbConfig);

AppGlobals.port = port;
AppGlobals.db = DBConnection.getInstance();
AppGlobals.sessionManager = InMemorySessionManager.getInstance();

// middleware setup
server.use(require("body-parser").json());
server.use(cookieParser());
server.use('/assets', express.static(path.resolve(__dirname, "../../web/public")));

function register<T extends Controller>(
    c: new (requ: express.Request, resp: express.Response) => T,
    func: (a: T) => any
) {
    return async (req: express.Request, res: express.Response) => {
        let instance = new c(req, res);
        let setupRes = await instance.setup();
        if (setupRes) {
            func(instance);
        }
    }
}

/**
 * Authentication and Personal information
 */
server.post('/login', register(LoginController, c => c.login()));
server.get('/userInfo', register(LoginController, c => c.userInfo()));
server.post('/logout', register(LoginController, c => c.logout()));

/**
 * Assessments and surveys
 */
server.get('/survey/all', register(AssessmentController, c => c.getAllSurveys()));
server.post('/survey/add', register(AssessmentController, c => c.addSurvey()));
server.get('/assessment/all', register(AssessmentController, c => c.getAllAssessments()));
server.get('/assessment/:type', register(AssessmentController, c => c.getAssessment()));
server.post('/assessment/add', register(AssessmentController, c => c.addAssessment()));
server.delete('/assessment/:type', register(AssessmentController, c => c.archiveAssessment()));


/**
 * Upload End points
 */
server.post('/upload/start/:id', register(UploadController, c => c.startUpload()));
server.post('/upload/video/:id', register(UploadController, c => c.uploadVideo()));
server.post('/upload/picture/:id', register(UploadController, c => c.uploadPicture()));
server.post('/upload/survey/:id', register(UploadController, c => c.uploadSurvey()));
server.post('/upload/end/:id', register(UploadController, c => c.endUpload()));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
server.get('/', (req: any, res: any) => res.sendFile(path.resolve(__dirname, "../../web/public/index.html")));

server.listen(port, () => console.log(`listening port ${port}`));
