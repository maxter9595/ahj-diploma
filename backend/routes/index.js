const combineRouters = require('koa-combine-routers');

const pingRouter = require('./ping');
const registerRouter = require('./register');
const loginRouter = require('./login');
const filesRouter = require('./files');
const attachmentRouter = require('./attachments');
const validate_mesRouter = require('./validate_mes');
const emojiRouter = require('./emoji');
const decryptionRouter = require('./decryptions');
const phraseRouter = require('./phrase');

const router = combineRouters(
  pingRouter,
  registerRouter,
  loginRouter,
  filesRouter,
  attachmentRouter,
  validate_mesRouter,
  emojiRouter,
  decryptionRouter,
  phraseRouter,
);

module.exports = router;
