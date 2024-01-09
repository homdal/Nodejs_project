import { RequestHandler } from "express";
import { auth } from "../service/auth-service";
import User from "../database/model/user";
import { extractToken } from "./validate-token";
import Card from "../database/model/card";
import { ICard } from "../@types/card";
import { BizCardsError } from "../error/biz-cards-error";

const isCreatorOrAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = extractToken(req);
    const verifiedToken = auth.verifyJWT(token);

    const user = await User.findOne({ _id: verifiedToken._id });
    if (!user) throw new BizCardsError("User not found", 404);
    const card = (await Card.findOne({ _id: id }).lean()) as ICard;
    if (!card) throw new BizCardsError("Card not found", 404);
    if (verifiedToken._id == card?.userId) return next();
    if (user.isAdmin) return next();

    res
      .status(401)
      .json({ message: "Only admin or the creator of the card may proceed" });
  } catch (e) {
    next(e);
  }
};

export { isCreatorOrAdmin };
