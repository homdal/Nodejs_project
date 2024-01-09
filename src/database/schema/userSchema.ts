import { Schema } from "mongoose";
import { IUser } from "../../@types/user";
import nameSchema from "./nameSchema";
import imageSchema from "./imageSchema";
import addressSchema from "./addressSchema";

const userSchema = new Schema<IUser>({
  name: { type: nameSchema },
  image: {
    type: imageSchema,
    required: false,
    default: {
      alt: "user icon",
      url: "https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_960_720.png",
    },
  },
  address: { type: addressSchema },
  phone: {
    required: true,
    type: String,
    minLength: 9,
    maxLength: 15,
  },
  email: {
    unique: true,
    required: true,
    type: String,
    minLength: 7,
    maxLength: 50,
  },
  password: {
    required: true,
    type: String,
    minLength: 7,
    maxLength: 100,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
});
export default userSchema;
