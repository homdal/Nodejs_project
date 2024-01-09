import { RequestHandler } from "express";
import { BizCardsError } from "../error/biz-cards-error";
import { auth } from "../service/auth-service";
import User from "../database/model/user";
import { extractToken } from "./validate-token";

const isBusiness: RequestHandler = async (req, res, next) => {
  try {
    const token = extractToken(req);
    const { _id } = auth.verifyJWT(token);

    const user = await User.findOne({ _id });
    if (!user) throw new BizCardsError("User not found", 404);
    req.user = user;
    const isBusiness = user?.isBusiness;
    if (isBusiness) {
      return next();
    }

    return res.status(401).json({ message: "Must be a business account" });
  } catch (e) {
    next(e);
  }
};

export { isBusiness };
