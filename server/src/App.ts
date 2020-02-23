import * as express from "express";
import * as path from "path";
import * as cookieParser from "cookie-parser";

const port: number = 3000;

let server = express();

//mock up data
import { Assessment, allAssessments, allSurveys, surveyDict } from "./AssessmentMaker";

// parse application/json
server.use(require("body-parser").json());
server.use(cookieParser());
server.use('/assets', express.static(path.resolve(__dirname, "../../web/public")));

interface User {
    username: string;
    displayName: string;
    gender: string;
    birthdate: string;
    password: string;
    type?: string;
}

const users: User[] = [
    {
        username: "admin",
        displayName: "Admin A",
        gender: "N/A",
        birthdate: "1970/01/01",
        password: "admin",
        type: "admin"
    }, {
        username: "lang",
        displayName: "Lang C",
        gender: "Male",
        birthdate: "9999/12/31",
        password: "123",
        type: "user"
    }, {
        username: "raymond",
        displayName: "Raymond Chen",
        gender: "Male",
        birthdate: "1997/01/09",
        password: "123",
        type: "user"
    },
];

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

server.get('/userInfo', (req: any, res: any) => {
    if (req.cookies.access_token) {
        for (const u of users) {
            if (u.username === req.cookies.access_token) {
                res.status(200).send({
                    username: u.username,
                    displayName: u.displayName,
                    gender: u.gender,
                    birthdate: u.birthdate,
                    type: u.type
                });
                return;
            }
        }
        res.status(404).send({ error: "Can't find specific user" });
    } else {
        res.status(401).send({ error: "Invalid credentials" });
    }
});

server.get('/available', (req: any, res: any) => {
    if (req.cookies.access_token) {
        res.send(allAssessments.map(a => { return { title: a.title, id: a.id } }));
    } else {
        res.status(401).send({ error: "Invalid credentials" });
    }
});

server.get('/allSurveys', (req: any, res: any) => {
    if (req.cookies.access_token) {
        for (const u of users) {
            if (u.username === req.cookies.access_token && u.type === "admin") {
                res.status(200).send(allSurveys.map(s => { return { title: s.sTitle, id: s.sId } }));
                return;
            }
        }
        res.status(404).send({ error: "Can't find specific user" });
    } else {
        res.status(401).send({ error: "Invalid credentials" });
    }
});

let idCounter: number = 1;
server.post('/addAssessment', (req: any, res: any) => {
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
                    surveys: assessForm.surveyIDs.map((id: string) => {return surveyDict.get(id)})
                }
                idCounter ++;
                allAssessments.push(newAssess);

                res.status(200).send({id: newAssess.id});
                return;
            }
        }
        res.status(404).send({ error: "Can't find specific user" });
    } else {
        res.status(401).send({ error: "Invalid credentials" });
    }
});

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
server.get('/', (req: any, res: any) => res.sendFile(path.resolve(__dirname, "../../web/public/index.html")));

server.listen(port, () => console.log(`listening port ${port}`));
