import { Schema, model } from "mongoose";

const cartItemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, default: 0 },
});

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  items: [cartItemSchema],
});

const cartModel = model('Cart', cartSchema);

export default cartModel;
