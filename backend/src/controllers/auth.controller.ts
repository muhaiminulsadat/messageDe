import {Request, Response} from "express";

const checkAuth = async (req: Request, res: Response) => {
  try {
    res.status(200).json({user: req.user});
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

export default checkAuth;
