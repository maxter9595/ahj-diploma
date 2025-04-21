const server = require('../server');
const Router = require('koa-router');

const router = new Router();

router.get('/emoji', async (ctx) => {
  ctx.response.body = {
    success: true,
    data: server.db.emoji,
  }
})

module.exports = router;
