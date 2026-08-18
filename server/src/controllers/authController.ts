import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { env } from "../config/env.js";
import { AuthRequest } from "../middleware/auth.js";
import { sanitizeUsername } from "../services/fulfillmentService.js";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, minecraftUsername } = req.body;

    if (!email || !password || password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Email and a password with at least 6 characters are required",
        code: "INVALID_INPUT",
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "An account with this email already exists",
        code: "EMAIL_EXISTS",
      });
      return;
    }

    let sanitizedMcUser: string | undefined = undefined;
    if (minecraftUsername) {
      try {
        sanitizedMcUser = sanitizeUsername(minecraftUsername);
      } catch {}
    }

    const passwordHash = await argon2.hash(password);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      minecraftUsername: sanitizedMcUser,
      role: "user",
    });

    const token = jwt.sign({ userId: user._id, role: user.role }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          minecraftUsername: user.minecraftUsername,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Registration failed", code: "REGISTRATION_FAILED" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required", code: "INVALID_INPUT" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.passwordHash) {
      res.status(401).json({ success: false, message: "Invalid email or password", code: "INVALID_CREDENTIALS" });
      return;
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      res.status(401).json({ success: false, message: "Invalid email or password", code: "INVALID_CREDENTIALS" });
      return;
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          minecraftUsername: user.minecraftUsername,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Login failed", code: "LOGIN_FAILED" });
  }
}

export async function getAccount(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
    return;
  }

  res.json({
    success: true,
    data: {
      _id: req.user._id,
      email: req.user.email,
      minecraftUsername: req.user.minecraftUsername,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
}

export async function getAccountOrders(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
    return;
  }

  const query: Record<string, any> = {
    $or: [{ userId: req.user._id }],
  };
  if (req.user.minecraftUsername) {
    query.$or.push({ minecraftUsername: req.user.minecraftUsername });
  }

  const orders = await Order.find(query).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
}
