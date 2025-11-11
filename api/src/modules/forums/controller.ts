import { Request, Response, NextFunction } from 'express';
import { getForumsHomepageData } from './service';

export const getForumsHomepageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getForumsHomepageData();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
