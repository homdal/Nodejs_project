import { ICard } from "../../@types/card";
import mongoose from "mongoose";
import addressSchema from "./addressSchema";
import imageSchema from "./imageSchema";

const cardSchema = new mongoose.Schema<ICard>({
  title: { type: String, required: true, minLength: 2, maxLength: 40 },
  subtitle: { type: String, required: true, minLength: 2, maxLength: 40 },
  description: { type: String, required: true, minLength: 2, maxLength: 100 },
  phone: { type: String, required: true, minLength: 9, maxLength: 15 },
  email: { type: String, required: true, minLength: 7, maxLength: 50 },
  web: { type: String, required: false, minLength: 0 },
  address: { type: addressSchema, required: true },
  image: {
    type: imageSchema,
    required: false,
    default: {
      alt: "illustration of a business",
      url: "https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png",
    },
  },
  userId: { type: String, required: true },
  bizNumber: {
    type: Number,
    required: false,
    default: () => Math.round(Math.random() * 1_000_000),
    unique: true,
  },
  createdAt: { type: Date, required: false, default: new Date() },
  likes: [{ type: String, required: false }],
});
export default cardSchema;
