import { Router } from 'express';
import { generateVerificationCode } from '../controllers/verification';
import { verifyCodeMiddleware } from '../middleware/verifyCode';

const router = Router();

// 生成验证码
router.post('/generate', generateVerificationCode);

// 验证码验证中间件
router.use('/verify', verifyCodeMiddleware);

export default router; 