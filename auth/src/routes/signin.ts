import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@tticker/common";
import "express-async-errors";
import { User } from "../models/User";
import { BadRequestError } from "@tticker/common";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
const router = express.Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Please enter a valid Email"),
    body("password").trim().notEmpty().withMessage("Please enter a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(existingUser);
  }
);
export { router as signInRouter };
