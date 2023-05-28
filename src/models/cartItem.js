const mongoose = require('mongoose');
// 스키마 생성
const { Schema } = mongoose;
const CartItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  quantity: {
    type: Number,
    default: 1,
  },
  // price: {
  //   type: Number,
  //   required: true,
  // },
});

// 모델 생성
const CartItem = mongoose.model('CartItem', CartItemSchema);
module.exports = CartItem;
