import { Schema } from "mongoose";
import { IImage } from "../../@types/user";
const imageSchema = new Schema<IImage>({
  alt: {
    type: String,
    required: false,
    minLength: 0,
    maxLength: 256,
    default: "user-profile",
  },
  url: {
    type: String,
    required: false,
    minLength: 0,
  },
});
export default imageSchema;
