import { RequestHandler } from "express";
import { BizCardsError } from "../error/biz-cards-error";
import { auth } from "../service/auth-service";
import User from "../database/model/user";
import { extractToken } from "./validate-token";

const isAdmin: RequestHandler = async (req, res, next) => {
  const token = extractToken(req);
  const { _id } = auth.verifyJWT(token);

  const user = await User.findOne({ _id });
  if (!user) throw new BizCardsError("User not found", 404);
  const isAdmin = user?.isAdmin;
  if (isAdmin) {
    return next();
  }

  return res.status(401).json({ message: "Must be admin" });
};

export { isAdmin, extractToken };
