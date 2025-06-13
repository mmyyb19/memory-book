import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user';
import { logger } from '../utils/logger';

export const verifyCodeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供验证码' });
    }

    const user = await UserModel.findByUsername(req.body.username);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    if (user.verification_code !== token) {
      return res.status(401).json({ message: '验证码无效' });
    }

    next();
  } catch (error) {
    logger.error('验证码验证错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 