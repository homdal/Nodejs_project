import Card from "../database/model/card";
import { ICardInput } from "../@types/card";
import { BizCardsError } from "../error/biz-cards-error";
const createCard = async (data: ICardInput, userId: string) => {
  const card = new Card(data);
  card.userId = userId;
  while (true) {
    const random = Math.floor(Math.random() * 1_000_000);
    const dbRes = await Card.findOne({ bizNumber: random });
    if (!dbRes) {
      card.bizNumber = random;
      break;
    }
  }

  return card.save();
};

const checkBizNumber = async (newBizNumber: number) => {
  if (newBizNumber.toString().length > 6 || newBizNumber.toString().length < 6)
    throw new BizCardsError("bizNumber must be a 6 digit number", 400);
  const checkIfAlreadyExists = await Card.findOne({ bizNumber: newBizNumber });
  if (checkIfAlreadyExists)
    throw new BizCardsError("bizNumber already exists, choose another", 400);
};

const checkLikes = (likeArray: Array<string>, userId: string) => {
  let isLiked = false;
  for (let like of likeArray) {
    if (like === userId) {
      isLiked = true;
      break;
    }
  }
  if (isLiked) {
    const newArray = likeArray.filter((like) => like != userId);
    return { array: newArray, like: false };
  } else {
    likeArray.push(userId);
    return { array: likeArray, like: true };
  }
};

export { createCard, checkLikes, checkBizNumber };
