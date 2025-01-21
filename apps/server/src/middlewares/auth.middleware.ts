import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

interface AccessTokenPayload extends JwtPayload {
  _id: string;
  email: string;
  username: string;
  fullName: string;
}

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser; // Adds `user` property to `Request`
  }
}

export const verifyUserAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers.authorization;

    // console.log("Access Token: ", accessToken);

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - no access token provided",
      });

      return;
    }

    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET || ""
    ) as AccessTokenPayload;

    if (!decodedAccessToken || !decodedAccessToken._id) {
      res.status(400).json({
        success: false,
        message: "Unauthorized - invalid access token",
      });

      return;
    }

    const user = await User.findById(decodedAccessToken._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Unauthorized - User not found",
      });
      return;
    }

    req.user = user;

    // console.log("User: ", (req as any).user);

    next();
  } catch (error: Error | any) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: error.message });
  }
};
