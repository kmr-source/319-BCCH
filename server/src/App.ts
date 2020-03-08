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

// DEPRECATE these dependencies are for legacy code only
import { Assessment, allAssessments, allSurveys, surveyDict, allUsers } from "./AssessmentMaker";
import { User } from "./models/IUser";
import { UserService } from "./services/UserService";

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


// DEPRECATED: this helper is for legacy endpoint only, should not use it anymore
function withAuth(handler: (req: any, res: any, user: User) => any) {

    let exposedHandler = async (req: any, res: any) => {
        let cookie = req.cookies.access_token;
        try {
            let user = await (new UserService()).getUser(cookie);
            handler(req, res, user);
        } catch {
            res.status(401).send({ error: "Invalid credentials" });
        }
    }

    return exposedHandler;
}

server.get('/assessment/all', withAuth(async (req, res, u) => {
    res.send(allAssessments.map(a => { return { title: a.title, id: a.id } }));
}));

server.get('/assessment/:type', (req: any, res: any) => {
    let type: string = req.params.type;
    let options: Assessment[] = allAssessments;

    for (let a of options) {
        if (a.id === type) {
            res.send(a);
            return;
        }
    }

    res.status(404).send({ error: `could not find assessment with id ${type}` });
});

server.get('/suvrey/all', withAuth((req, res, u) => {
    res.status(200).send(allSurveys.map(s => { return { title: s.sTitle, id: s.sId } }));
}));

let idCounter: number = 1;
server.post('/assessment/add', (req: any, res: any) => {
    if (req.cookies.access_token) {
        for (const u of allUsers) {
            if (u.username === req.cookies.access_token && u.type === "admin") {
                let assessForm: any = req.body;
                let newAssess: Assessment = {
                    title: assessForm.title,
                    id: `survey_${idCounter}`,
                    desc: assessForm.desc,
                    pictures: assessForm.pictures,
                    videos: assessForm.videos,
                    surveys: assessForm.surveyIDs.map((id: string) => { return surveyDict.get(id) })
                }
                idCounter++;
                allAssessments.push(newAssess);

                res.status(200).send({ id: newAssess.id });
                return;
            }
        }
        res.status(404).send({ error: "Can't find specific user" });
    } else {
        res.status(401).send({ error: "Invalid credentials" });
    }
});


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
 * Routes that will be used in the final project. Remove the old endpoint when done
 */
server.post('/login', register(LoginController, c => c.login()));
server.get('/userInfo', register(LoginController, c => c.userInfo()));
server.post('/logout', register(LoginController, c => c.logout()))

/*
server.get('/assessment/all', register(AssessmentController, c => c.getAllAssessments()));
server.get('/assessment/:type', register(AssessmentController, c => c.getAssessment()));
server.get('/suvrey/all', register(AssessmentController, c => c.getAllSurveys()));
server.post('/assessment/add', register(AssessmentController, c => c.addAssessment()));
server.delete('/assessment/:type', register(AssessmentController, c => c.archiveAssessment()));
server.delete('/survey/:id', register(AssessmentController, c => c.archiveSurvey()));
*/

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
server.get('/', (req: any, res: any) => res.sendFile(path.resolve(__dirname, "../../web/public/index.html")));

server.listen(port, () => console.log(`listening port ${port}`));
