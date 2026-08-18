import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[API Error] ${req.method} ${req.url}:`, err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";
  const code = err.code || "INTERNAL_SERVER_ERROR";

  res.status(status).json({
    success: false,
    message,
    code,
  });
}
