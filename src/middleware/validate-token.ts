import { RequestHandler, Request } from "express";
import { BizCardsError } from "../error/biz-cards-error";
import { auth } from "../service/auth-service";
import User from "../database/model/user";

const extractToken = (req: Request) => {
  const authHeader = req.header("Authorization");

  if (
    authHeader &&
    authHeader.length > 7 &&
    authHeader.toLowerCase().startsWith("bearer ")
  ) {
    return authHeader.substring(7);
  }
  throw new BizCardsError("token is missing in Authorization header", 400);
};

const validateToken: RequestHandler = async (req, res, next) => {
  const token = extractToken(req);
  const { _id } = auth.verifyJWT(token);
  const user = await User.findOne({ _id });
  if (!user) throw new BizCardsError("User not found", 404);
  req.user = user;
  next();
};

export { validateToken, extractToken };
