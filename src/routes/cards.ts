import { Router } from "express";
import { isBusiness } from "../middleware/is-business";
import { validateCard } from "../middleware/validation";
import {
  createCard,
  checkLikes,
  checkBizNumber,
} from "../service/card-service";
import { ICardInput } from "../@types/card";
import { isCreator } from "../middleware/is-creator";
import { isAdmin } from "../middleware/is-admin";
import { isCreatorOrAdmin } from "../middleware/is-creator-or-admin";
import { BizCardsError } from "../error/biz-cards-error";
import Card from "../database/model/card";
import { validateToken } from "../middleware/validate-token";
import { Logger } from "../logs/logger";
const router = Router();

router.post("/", isBusiness, validateCard, async (req, res, next) => {
  try {
    const id = req.user?._id;
    if (!id)
      throw new BizCardsError("Must have user id / must be logged in", 401);
    const savedCard = await createCard(req.body as ICardInput, id);
    Logger.verbose("created new card");
    res.json({ card: savedCard });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const cards = await Card.find();
    if (!cards.length)
      throw new BizCardsError("No Cards found in database", 404);
    Logger.info("retrieved cards");
    return res.json(cards);
  } catch (e) {
    next(e);
  }
});

router.get("/my-cards", validateToken, async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const cards = await Card.find({ userId });
    if (!cards.length)
      throw new BizCardsError("No Cards found that belong to the user", 404);
    Logger.info("retrieved cards");
    return res.json(cards);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) throw new BizCardsError("Requested card not found", 404);
    Logger.info("retrieved card");
    return res.json(card);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", isCreator, validateCard, async (req, res, next) => {
  try {
    const savedCard = await Card.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!savedCard)
      throw new BizCardsError("Card to be updated not found", 404);
    Logger.info("card has been updated");
    res.json(savedCard);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    const { likes } = await Card.findOne({ _id: req.params.id });
    const newLikesObject = checkLikes(likes, userId);
    const updatedCard = await Card.findByIdAndUpdate(
      { _id: req.params.id },
      { likes: newLikesObject.array },
      { new: true }
    );
    if (!updatedCard)
      throw new BizCardsError("Card to be liked not found", 404);
    if (newLikesObject.like) {
      Logger.info("card has been liked");
    } else if (!newLikesObject.like) {
      Logger.info("card has been unliked");
    }
    res.json(updatedCard);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", isCreatorOrAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const cardToDelete = await Card.findOneAndDelete({ _id: id });
    if (!cardToDelete)
      throw new BizCardsError("Card to be deleted not found", 404);
    Logger.verbose("card has been deleted");
    return res.json(cardToDelete);
  } catch (e) {
    next(e);
  }
});

router.patch("/business/:id", isAdmin, async (req, res, next) => {
  try {
    const newBizNumber = req.body.bizNumber;
    await checkBizNumber(newBizNumber);
    const updatedCard = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { bizNumber: newBizNumber },
      { new: true }
    );
    if (!updatedCard)
      throw new BizCardsError("Card to be updated not found", 404);
    return res.json(updatedCard);
  } catch (e) {
    next(e);
  }
});

export { router as cardsRouter };
