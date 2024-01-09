import Joi from "joi";
import { ICard } from "../@types/card";
import { phoneRegex, zipRegex } from "./patterns";
import { IAddress, IImage } from "../@types/user";

const cardSchema = Joi.object<ICard>({
  title: Joi.string()
    .messages({
      "string.empty": "must enter a title",
      "string.min": "must be at least 2 characters long",
      "string.max": "cannot be longer than 40 characters",
    })
    .required()
    .min(2)
    .max(40),
  subtitle: Joi.string()
    .messages({
      "string.empty": "must enter a subtitle",
      "string.min": "must be at least 2 characters long",
      "string.max": "cannot be longer than 40 characters",
    })
    .required()
    .min(2)
    .max(40),
  description: Joi.string()
    .messages({
      "string.empty": "must enter a description",
      "string.min": "must be at least 2 characters long",
      "string.max": "cannot be longer than 100 characters",
    })
    .required()
    .min(2)
    .max(100),
  phone: Joi.string()
    .messages({
      "string.pattern.base": "must be a valid phone number",
      "string.empty": "must provide a phone number",
      "string.min": "must be at least 9 characters long",
      "string.max": "cannot be longer than 15 characters",
    })
    .required()
    .pattern(phoneRegex)
    .min(9)
    .max(15),
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
  web: Joi.string()
    .messages({
      "string.min": "must be at least 14 characters long",
    })
    .min(14)
    .allow(""),
  image: Joi.object<IImage>({
    url: Joi.string().min(14).allow(""),
    alt: Joi.string().min(2).max(256).allow(""),
  }),
  address: Joi.object<IAddress>({
    state: Joi.string().allow("").min(2).max(256),
    country: Joi.string()
      .required()
      .messages({
        "string.empty": "must enter a country",
        "string.min": "must be at least 2 characters long",
        "string.max": "cannot be longer than 20 characters",
      })
      .min(2)
      .max(20),
    city: Joi.string()
      .required()
      .messages({
        "string.empty": "must enter a city",
        "string.min": "must be at least 2 characters long",
        "string.max": "cannot be longer than 20 characters",
      })
      .min(2)
      .max(20),
    street: Joi.string()
      .required()
      .messages({
        "string.empty": "must enter a street",
        "string.min": "must be at least 2 characters long",
        "string.max": "cannot be longer than 50 characters",
      })
      .min(2)
      .max(50),
    houseNumber: Joi.number()
      .required()
      .messages({
        "string.empty": "must enter house number",
        "number.base": "house number has to be a number",
        "string.min": "must be at least 1 characters long",
        "string.max": "cannot be longer than 2 characters",
      })
      .min(1)
      .max(2),
    zip: Joi.string()
      .pattern(zipRegex)
      .messages({
        "string.empty": "must enter zip code",
        "string.pattern.base": "zip code has to be a number",
        "string.min": "must be at least 2 characters long",
        "string.max": "cannot be longer than 7 characters",
      })
      .min(2)
      .max(7)
      .required(),
  }),
});

export { cardSchema };
