const server = require('../server');
const Router = require('koa-router');

const router = new Router();

router.post('/attachments', async (ctx) => {
  const { body } = ctx.request;
  ctx.response.body = {
    success: true,
    data: server.db.getAttachments(body.dialog, body.dialogID)
  }
});

module.exports = router;
