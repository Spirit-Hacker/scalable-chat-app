import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

interface CustomeJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  username: string;
  fullName: string;
}

export const verifyUserAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log("accessToken: ", accessToken);
    console.log("req cookies: ", req.cookies);

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - noaccess token provided",
      });

      return;
    }

    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET || ""
    ) as CustomeJwtPayload;

    if (!decodedAccessToken || !decodedAccessToken._id) {
      res.status(400).json({
        success: false,
        message: "Unauthorized - invalid access token",
      });

      return;
    }

    const user = await User.findById(decodedAccessToken._id);

    (req as any).user = user;

    next();
  } catch (error: Error | any) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: error.message });
  }
};
