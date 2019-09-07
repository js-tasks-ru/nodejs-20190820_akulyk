const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  if (ctx.query.query) {
    const products = await Product.find(
        {$text: {$search: ctx.query.query}},
        {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}}
        );

    ctx.body = {products: products};
    return;
  }

  ctx.body = {products: []};
};
