import { RequestHandler } from "express";
import { auth } from "../service/auth-service";
import User from "../database/model/user";
import { extractToken } from "./validate-token";
import { BizCardsError } from "../error/biz-cards-error";
import { IUser } from "../@types/user";

const isUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = extractToken(req);
    const { _id } = auth.verifyJWT(token);
    const user = (await User.findOne({ _id }).lean()) as IUser;
    if (!user) throw new BizCardsError("User not found", 404);

    req.user = user;

    if (id == user?._id) return next();

    res.status(401).json({ message: "The id must belong to the user" });
  } catch (e) {
    next(e);
  }
};

export { isUser };
