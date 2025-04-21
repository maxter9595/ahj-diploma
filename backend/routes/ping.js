const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx) => {
  ctx.response.body = 'Сервер в порядке';
});

module.exports = router;
