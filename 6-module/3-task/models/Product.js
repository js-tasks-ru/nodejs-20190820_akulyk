const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  images: [String],

});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});

productSchema.index(
    {title: 'text', description: 'text'},
    {default_language: 'russian',
      weights: {
        title: 10,
        description: 5,
      },
      name: 'TextSearchIndex',
    },
);

module.exports = connection.model('Product', productSchema);
