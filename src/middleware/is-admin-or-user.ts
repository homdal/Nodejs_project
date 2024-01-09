import { RequestHandler } from "express";
import { auth } from "../service/auth-service";
import User from "../database/model/user";
import { extractToken } from "./validate-token";
import { BizCardsError } from "../error/biz-cards-error";

const isAdminOrUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = extractToken(req);
    const { _id } = auth.verifyJWT(token);

    const user = await User.findOne({ _id });

    if (!user) throw new BizCardsError("User not found", 404);

    if (id == user.id) return next();

    if (user.isAdmin) return next();

    res
      .status(401)
      .json({ message: "Only admin or the user in question may proceed" });
  } catch (e) {
    next(e);
  }
};

export { isAdminOrUser };
