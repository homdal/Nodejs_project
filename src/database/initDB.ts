import { Logger } from "../logs/logger";
import User from "./model/user";
import Card from "./model/card";
import { users } from "./initialUsers";
import { cards } from "./initialCards";
const initDB = async () => {
  const usersCount = await User.countDocuments();
  const cardCount = await Card.countDocuments();
  if (usersCount != 0 && cardCount != 0) {
    return;
  }
  if (usersCount == 0) {
    for (let user of users) {
      const saved = await new User(user).save();
      Logger.verbose("Added user:", saved);
    }
  }
  if (cardCount == 0) {
    const admin = await User.findOne({ isAdmin: true });
    for (let card of cards) {
      card.userId = admin._id;
      const saved = await new Card(card).save();
      Logger.verbose("Added card:", saved);
    }
  }
};

export { initDB };
