import * as express from "express";
import * as path from "path";

const port: number = 3000;

let server = express();

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
]

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
