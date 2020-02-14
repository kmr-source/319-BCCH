import * as express from "express";
import * as path from 'path';

let server = express();

const port: number = 3000;
server.use('/assets', express.static(path.resolve(__dirname, "../../web/public")));
// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
server.get('*', (req: any, res: any) => res.sendFile(path.resolve(__dirname, "../../web/public/index.html")));
server.listen(port, () => console.log(`listening port ${port}`));
