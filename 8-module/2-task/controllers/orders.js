const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const orderMap = require('../mappers/order');
const productMap = require('../mappers/product');

module.exports.checkout = async function checkout(ctx, next) {
  const {product, phone, address} = ctx.request.body;

  const order = new Order({
    user: ctx.user._id,
    product: product,
    phone,
    address,
  });
  await order.save();

  const productEntity = await Product.findOne({_id: product});
  if (! productEntity) {
    ctx.throw(404, 'Product not found!');
  }

  await sendMail({
    template: 'order-confirmation',
    to: ctx.user.email,
    subject: 'Order success!',
    locals: {id: order._id, product: productEntity},
  });
  ctx.status = 200;
  ctx.body = {order: order._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const ordersTmp = await Order.find({user: ctx.user._id}).populate('User').exec();
  const orders = [];
  for await (const order of ordersTmp) {
    const product = await Product.findOne({_id: order.product});
    const orderMapped = orderMap(order);
    const productMapped = productMap(product);
    orderMapped.product = productMapped;

    orders.push(orderMapped);
  };

  ctx.status = 200;
  ctx.body = {orders};
};
