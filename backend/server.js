require('dotenv').config();

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const WS = require('ws');
const cors = require('@koa/cors');
const koaStatic = require('koa-static');
const path = require('path');
const router = require('./routes');
const { v4: uuidv4 } = require('uuid');
const DataBase = require('./db');
const wsMessageHandler = require('./helpers/wsMessageHandler');

const app = new Koa();
const public = path.join(__dirname, 'public');

exports.public = public;
app.use(koaStatic(public));

const db = new DataBase();
exports.db = db;

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));
app.use(cors({
  origin: '*',
  credentials: true,
  'Access-Control-Allow-Origin': true
}));
app.use(router());

const server = http.createServer(app.callback());
const wsServer = new WS.Server({ server });

wsServer.on('connection', (ws) => {
  const sendingToAll = (data) => {
    for (let client of db.clients.keys()) {
      if (client.readyState === WS.OPEN) {
        client.send(data);
      }
    }
  }

  ws.on('message', async (msg) => {
    const decoder = new TextDecoder('utf-8');
    const data = await JSON.parse(decoder.decode(msg));

    if (data.type === 'ping') {
      db.clients.set(ws, data.data.user)
    }

    const result = wsMessageHandler(data)

    if (data.type === 'more_messages') {
      if(ws.readyState === 1) {
        ws.send(result);
      }
    } else {
      sendingToAll(result);
    }
  });

  ws.on('close', () => {
    db.setOflineStatus(db.clients.get(ws));
    db.clients.delete(ws);

    const data = JSON.stringify({
      type: 'logout',
      users: db.users,
    });

    if (data) {
      sendingToAll(data);
    }
  });

  ws.on('error', (err) => {
    console.log('Error: ', err);
  })
});

const port = process.env.PORT || 7071;
server.listen(port);
console.log(`the server is started on port ${port}`);
