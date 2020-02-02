let express = require('express');
let server = express();
const path = require('path');

const port = 3000;
server.use('/assets', express.static(path.resolve(__dirname, "../web/public")));
server.get('/', (req, res) => res.sendFile(path.resolve(__dirname, "../web/public/index.html")));

server.listen(port, () => console.log(`listening port ${port}`));
