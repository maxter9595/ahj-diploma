const faker = require('faker');
const Router = require('koa-router');

const router = new Router();

faker.locale = 'ru';

router.get('/phrase', async (ctx) => {
  ctx.response.body = {
    success: true,
    data: faker.hacker.phrase(),
  }
})

module.exports = router;
