import {Request, Response, NextFunction} from "express";
import {fromNodeHeaders} from "better-auth/node";
import {auth} from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({message: "Unauthorized"});
    }

    req.user = session.user.id;

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

export default protectRoute;
