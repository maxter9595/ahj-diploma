const server = require('../server');
const Router = require('koa-router');

const router = new Router();

router.post('/login', async (ctx) => {
  if (server.db.checkUser(ctx.request.body)) {
    ctx.response.body = {
      success: true,
      data: {
        user: server.db.getUser(ctx.request.body),
        users: server.db.users,
        groups: server.db.groups,
      }
    }
  } else {
    ctx.response.body = {
      success: false,
    }
  }
});

module.exports = router;
