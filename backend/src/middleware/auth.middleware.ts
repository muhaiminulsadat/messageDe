import {Request, Response, NextFunction} from "express";
import {fromNodeHeaders} from "better-auth/node";
import {auth} from "../lib/auth.js";

export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
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

    req.user = session.user;

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

export default protectRoute;
