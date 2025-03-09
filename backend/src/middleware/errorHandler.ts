import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong!",
  });
};
