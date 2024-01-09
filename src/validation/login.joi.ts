import Joi from "joi";
import { passwordRegex } from "./patterns";
import { ILogin } from "../@types/user";

const schema = Joi.object<ILogin>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "must provide an email",
      "string.email":
        "must be a valid email address, example: name@example.com",
      "string.min": "must be at least 7 characters long",
      "string.max": "cannot be longer than 50 characters",
    })
    .min(7)
    .max(50),
  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.pattern.base":
        "the password must be between 7 to 20 characters in length containing at least one upper case letter, one lower case, one number and one of the following symbols !@#$%^&*",
      "string.empty": "must provide a password",
      "string.min": "must be at least 7 characters long",
      "string.max": "cannot be longer than 20 characters",
    })
    .min(7)
    .max(20),
});

export { schema as joiLoginSchema };
