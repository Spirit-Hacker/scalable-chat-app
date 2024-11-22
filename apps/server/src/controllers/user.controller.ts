import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

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

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findByIdAndUpdate(
      { userId },
      {
        $unset: {
          refreshToken: 1,
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
    // const userId = "673c92f9efaa5f0e4077763b";

    const users = await User.find({ _id: { $ne: userId } });
    if (!users) {
      res.status(400).json({
        success: false,
        message: "No users found.",
      });
      return;
    }

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
