const mongoose = require('mongoose');
const connection = require('../libs/connection');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: [
      {
        validator(value) {
          return /\+?\d{6,14}/.test(value);
        },
        message: 'Неверный формат номера телефона.',
      },
    ],
  },
  address: {
    type: String,
    required: true,
  },
});

orderSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});

orderSchema.set('toJson', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});

module.exports = connection.model('Order', orderSchema);
