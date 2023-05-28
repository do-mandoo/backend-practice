const mongoose = require('mongoose');
// 스키마 생성
const { Schema } = mongoose;
const ProductItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
});

// 모델 생성
const ProductItem = mongoose.model('ProductItem', ProductItemSchema);
module.exports = ProductItem;
