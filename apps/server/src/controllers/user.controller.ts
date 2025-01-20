import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { Schema } from "mongoose";

interface refreshTokenPayload extends JwtPayload {
  _id: string;
}

const generateAccessAndRefreshToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  return { accessToken, refreshToken };
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, username, email, password } = req.body;

    if (
      [fullName, username, email, password].some(
        (field) => field?.trim() === "" || field === undefined || field === null
      )
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
      return;
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      res.status(400).json({
        success: false,
        message: "User already exists.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully.",
      data: newUser,
    });

    return;
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (
      [username, password].some(
        (field) => field?.trim() === "" || field === undefined || field === null
      )
    ) {
      res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
      return;
    }

    const user = await User.findOne({ username });

    if (!user || !user._id) {
      res.status(400).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        message: "Password is incorrect.",
      });
      return;
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id.toString()
    );

    user.refreshToken = refreshToken;
    user.isOnline = true;
    await user.save();

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "none",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "User logged in successfully.",
        data: {
          user: user,
          accessToken,
          refreshToken,
        },
      });

    return;
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.headers.authorization;

    console.log("Req Headers: ", req.headers);

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required.",
      });
      return;
    }

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || ""
    ) as refreshTokenPayload;

    if (!decodedRefreshToken || !decodedRefreshToken._id) {
      res.status(400).json({
        success: false,
        message: "Invalid refresh token.",
      });
      return;
    }

    const user = await User.findById(decodedRefreshToken._id);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    const accessToken = user.generateAccessToken();

    if (!accessToken) {
      res.status(400).json({
        success: false,
        message: "Failed to generate access token.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      data: {
        accessToken,
      },
    });

    return;
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).body.userId;
    console.log("User Id: ", userId);
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
          isOnline: 1,
        },
      },
      { new: true }
    );

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "none",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "User logged out, successfully",
      });

    return;
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const users = await User.find();

    if (!users) {
      res.status(400).json({
        success: false,
        message: "No users found.",
      });
      return;
    }

    // console.log("Users: ", users);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: users,
    });

    return;
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const { _id : userId } = (req as any).user;
    console.log("Uploader Id: ", userId);
    console.log("Req File: ", req.files);

    if (!req.file || !req.file.path) {
      res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
      return;
    }

    const profilePicture = await uploadOnCloudinary(req.file.path);

    if (!profilePicture) {
      res.status(400).json({
        success: false,
        message: "Failed to upload profile picture.",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePicture.secure_url },
      { new: true }
    );

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully.",
      data: user,
    });

    return;
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }
};
