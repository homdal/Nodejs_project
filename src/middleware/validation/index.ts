import { joiLoginSchema } from "../../validation/login.joi";
import registerSchema from "../../validation/user.joi";
import { validateSchema } from "./validate-schema";
import { cardSchema } from "../../validation/card.joi";

const validateRegistration = validateSchema(registerSchema);
const validateLogin = validateSchema(joiLoginSchema);
const validateCard = validateSchema(cardSchema);

export { validateRegistration, validateLogin, validateCard };
