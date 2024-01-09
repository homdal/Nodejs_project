import { Schema } from "mongoose";
import { IName } from "../../@types/user";
const nameSchema = new Schema<IName>({
  first: {
    required: true,
    type: String,
    minLength: 2,
    maxLength: 20,
  },
  middle: {
    required: false,
    default: "",
    type: String,
    minLength: 0,
    maxLength: 20,
  },
  last: {
    required: true,
    type: String,
    minLength: 2,
    maxLength: 20,
  },
});
export default nameSchema;
