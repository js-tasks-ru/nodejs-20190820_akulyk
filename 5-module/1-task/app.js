const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(__dirname + '/public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();


let messageReceived;

let promise = createPromise();

router.get('/subscribe', async (ctx, next) => {
  const message = await promise;
  if (!message) {
    ctx.statusCode = 405;
    ctx.body = null;
  } else {
    ctx.statusCode = 200;
    ctx.body = message;
  }
  promise = createPromise();
  return;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message) {
    messageReceived(message);
  }

  ctx.statusCode = 200;
  ctx.body = 'Ok';
});

function createPromise() {
  return new Promise((resolve) => messageReceived = resolve);
}

app.use(router.routes());

module.exports = app;
