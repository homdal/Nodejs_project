import { Schema } from "mongoose";
import { IAddress } from "../../@types/user";
const addressSchema = new Schema<IAddress>({
  street: { type: String, required: true, minLength: 2, maxLength: 50 },
  city: { type: String, required: true, minLength: 2, maxLength: 20 },
  country: { type: String, required: true, minLength: 2, maxLength: 20 },
  state: {
    type: String,
    default: "",
    required: false,
    minLength: 0,
    maxLength: 20,
  },
  houseNumber: { type: Number, required: true, minLength: 1, maxLength: 2 },
  zip: {
    type: String,
    required: false,
    default: "0",
    minLength: 0,
    maxLength: 7,
  },
});
export default addressSchema;
