const server = require('../server');
const Router = require('koa-router');

const router = new Router();

router.post('/validate_mes', async (ctx) => {
  const { body } = ctx.request;
  ctx.response.body = {
    success: true,
    data: server.db.filterMessages(body),
  }
})

module.exports = router;
