const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (ctx.query.subcategory) {
    if (!mongoose.Types.ObjectId.isValid(ctx.query.subcategory)) {
      ctx.status = 404;
      ctx.body = {products: []};
      return;
    }

    const products = await Product.find({subcategory: ctx.query.subcategory});

    ctx.body = {products: products};
    return;
  }

  await next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.status = 200;
  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;

    return;
  }

  const product = await Product.findById(ctx.params.id);
  if (! product) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }


  ctx.body = {product: product};
};
