const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();


router.get('/', async function(ctx, next) {
  ctx.body = 'Hello, World!!!';
});


app.use(router.routes());

app.listen(3000, ()=> {
  console.info( `Application started...` );
});
