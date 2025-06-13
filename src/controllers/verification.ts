import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { logger } from '../utils/logger';

export const generateVerificationCode = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: '用户名不能为空' });
    }

    // 生成6位随机数字验证码
    const verification_code = Math.floor(100000 + Math.random() * 900000).toString();

    // 查找用户是否存在
    let user = await UserModel.findByUsername(username);
    
    if (user) {
      // 更新验证码
      user = await UserModel.updateVerificationCode(username, verification_code);
    } else {
      // 创建新用户
      user = await UserModel.create(username, verification_code);
    }

    logger.info(`为用户 ${username} 生成验证码成功`);
    res.json({ verification_code });
  } catch (error) {
    logger.error('生成验证码错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 