import { Router } from "express";
import { ILogin, IUser } from "../@types/user";
import User from "../database/model/user";
import { validateLogin, validateRegistration } from "../middleware/validation";
import { createUser, validateUser } from "../service/user-service";
import { isAdmin } from "../middleware/is-admin";
import { isAdminOrUser } from "../middleware/is-admin-or-user";
import { isUser } from "../middleware/is-user";
import { auth } from "../service/auth-service";
import { BizCardsError } from "../error/biz-cards-error";
import { Logger } from "../logs/logger";

const router = Router();

router.get("/", isAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find();
    if (!allUsers.length)
      throw new BizCardsError("No users found in database", 404);
    Logger.info("retrieved users");
    res.json(allUsers);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", isUser, validateRegistration, async (req, res, next) => {
  req.body.password = await auth.hashPassword(req.body.password);

  const savedUser = await User.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  if (!savedUser)
    throw new BizCardsError("The user to be updated not found", 404);
  Logger.info("updated user");
  res.json(savedUser);
});

router.get("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = (await User.findById(id).lean()) as IUser;
    if (!user) throw new BizCardsError("Requested user not found", 404);
    const { password, ...rest } = user;
    Logger.info("retrieved user");
    return res.json({ user: rest });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userTodelete = await User.findOne({ _id: id });
    if (!userTodelete)
      throw new BizCardsError("User to be deleted not found", 404);
    if (userTodelete.isAdmin)
      throw new BizCardsError("Not allowed to delete Admin User", 403);
    const deletion = await User.deleteOne({ _id: id });
    if (deletion.acknowledged) {
      Logger.verbose("deleted the user");
      return res.json(userTodelete);
    } else {
      throw new BizCardsError("Failed to delete user", 500);
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", validateRegistration, async (req, res, next) => {
  try {
    const saved = await createUser(req.body as IUser);
    Logger.verbose("created new user");
    res.status(201).json({ message: "Saved", user: saved });
  } catch (err) {
    next(err);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body as ILogin;
    const jwt = await validateUser(email, password);
    res.json(jwt);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", isAdminOrUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBusiness } = req.body;
    const updateIsBusiness = await User.findOneAndUpdate(
      { _id: id },
      { $set: { isBusiness: isBusiness } },
      { new: true }
    );
    if (!updateIsBusiness)
      throw new BizCardsError("User to be updated not found", 404);
    if (isBusiness) {
      Logger.info("changed to business");
    } else if (!isBusiness) {
      Logger.info("changed to non-business");
    }
    res.json(updateIsBusiness);
  } catch (e) {
    next(e);
  }
});

export { router as usersRouter };
