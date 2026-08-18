import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin authorization required",
      code: "FORBIDDEN",
    });
    return;
  }
  next();
}
