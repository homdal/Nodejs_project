import { RequestHandler } from "express";
import { auth } from "../service/auth-service";
import Card from "../database/model/card";
import { extractToken } from "./validate-token";
import { BizCardsError } from "../error/biz-cards-error";
import { ICard } from "../@types/card";

const isCreator: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = extractToken(req);
    const verifiedToken = auth.verifyJWT(token);
    const card = (await Card.findOne({ _id: id }).lean()) as ICard;

    if (!card) throw new BizCardsError("Card not found", 404);
    if (verifiedToken._id == card?.userId) return next();

    res.status(401).json({ message: "Must be the creator of the card" });
  } catch (e) {
    next(e);
  }
};

export { isCreator };
