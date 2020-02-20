import * as express from "express";
import * as path from "path";

const port: number = 3000;

let server = express();

//mock up data
import { Assessment, allAssessments } from "./AssessmentMaker";

// parse application/json
server.use(require("body-parser").json());
server.use('/assets', express.static(path.resolve(__dirname, "../../web/public")));

interface User {
    username: string;
    password: string;
    type?: string;
}

const users: User[] = [
    {
        username: "admin",
        password: "admin",
        type: "admin"
    }, {
        username: "lang",
        password: "123",
        type: "user"
    }, {
        username: "raymond",
        password: "123",
        type: "user"
    },
];

server.get('/assessment/:type', (req, res) => {
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


server.post('/login', (req, res) => {
    console.log(req.body);
    let body: User = req.body;
    if (body.username == null || body.password == null) {
        res.status(400).send({ error: "Missing required parameters" });
        return;
    }

    for (const u of users) {
        if (u.username === body.username && u.password === body.password) {
            res.send({ username: u.username, type: u.type, token: 123 });
            return;
        }
    }

    res.status(401).send({ error: "Invalid credentials" });
});

server.get('/upload', (req, res) => {
    res.send();
});

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
server.get('/', (req: any, res: any) => res.sendFile(path.resolve(__dirname, "../../web/public/index.html")));

server.listen(port, () => console.log(`listening port ${port}`));
