import { Request, Response, NextFunction } from "express";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
