import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
import { DBConnection, DBConfig } from "./DBConnection";
import { AssessmentTemplateImpl } from "./models/AssessmentTemplate";
import { SurveyTemplateImpl } from "./models/SurveyTemplate";
import { LoginController } from "./controllers/LoginController";
import { AssessmentController } from "./controllers/AssessmentController";
import { Controller } from "./controllers/Controller";

const port: number = 3000;

let server = express();

//mock up data
import { Assessment, allAssessments, allSurveys, surveyDict } from "./AssessmentMaker";
import {User} from "./models/IUser";

// setup database
let dbConfigJson = fs.readFileSync(path.resolve(__dirname, "../../db-conf.json"));
let dbConfig: DBConfig = JSON.parse(dbConfigJson.toString());
DBConnection.updateConfig(dbConfig);

// parse application/json
server.use(require("body-parser").json());
server.use(cookieParser());
server.use('/assets', express.static(path.resolve(__dirname, "../../web/public")));

const users: User[] = [
    {
        username: "admin",
        displayName: "Admin A",
        gender: "N/A",
        birthdate: "1970/01/01",
        password: "admin",
        age: 99,
        type: "admin"
    }, {
        username: "lang",
        displayName: "Lang C",
        gender: "Male",
        birthdate: "9999/12/31",
        password: "123",
        age: 99,
        type: "user"
    }, {
        username: "raymond",
        displayName: "Raymond Chen",
        gender: "Male",
        birthdate: "1997/01/09",
        password: "123",
        age: 99,
        type: "user"
    },
];

function withAuth(handler: (req: any, res: any, user: User) => any) {

    interface SearchResponse {
        found: boolean,
        value: any
    }

    let verifyLogin = (cookie: any, ): SearchResponse => {
        if (cookie) {
            for (const u of users) {
                if (u.username === cookie) {
                    return { found: true, value: u };
                }
            }
        }

        return { found: false, value: "" };
    }

    let exposedHandler = (req: any, res: any) => {
        let result = verifyLogin(req.cookies.access_token);
        if (result.found) {
            let user: User = result.value;
            handler(req, res, user);
        } else {
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


server.post('/login', (req: any, res: any) => {
    let body: User = req.body;
    if (body.username == null || body.password == null) {
        res.status(400).send({ error: "Missing required parameters" });
        return;
    }

    for (const u of users) {
        if (u.username === body.username && u.password === body.password) {
            res.send({
                username: u.username,
                displayName: u.displayName,
                gender: u.gender,
                birthdate: u.birthdate,
                type: u.type
            });
            return;
        }
    }

    res.status(401).send({ error: "Invalid credentials" });
});

server.get('/userInfo', withAuth((req: any, res: any, u: User) => {
    res.status(200).send({
        username: u.username,
        displayName: u.displayName,
        gender: u.gender,
        birthdate: u.birthdate,
        type: u.type
    });
}));

server.get('/suvrey/all', withAuth((req, res, u) => {
    res.status(200).send(allSurveys.map(s => { return { title: s.sTitle, id: s.sId } }));
}));

let idCounter: number = 1;
server.post('/assessment/add', (req: any, res: any) => {
    if (req.cookies.access_token) {
        for (const u of users) {
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
    return (req: express.Request, res: express.Response) => {
        let instance = new c(req, res);
        func(instance);
    }
}
/**
 * Routes that will be used in the final project. Remove the old endpoint when done
 * 
 */

/*
server.post('/login', register(LoginController, c => c.login()));
server.get('/userInfo', register(LoginController, c => c.userInfo()));
server.get('/assessment/all', register(AssessmentController, c => c.getAllAssessments()));
server.get('/assessment/:type', register(AssessmentController, c => c.getAssessment()));
server.get('/suvrey/all', register(AssessmentController, c => c.getAllSurveys()));
server.post('/assessment/add', register(AssessmentController,gotg c => c.addAssessment()));
*/

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
server.get('/', (req: any, res: any) => res.sendFile(path.resolve(__dirname, "../../web/public/index.html")));

server.listen(port, () => console.log(`listening port ${port}`));
