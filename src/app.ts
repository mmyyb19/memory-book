import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import verificationRoutes from './routes/verification';

dotenv.config();

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
});
app.use(limiter);

// 路由
app.use('/api/verification', verificationRoutes);

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response) => {
  logger.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT}`);
}); 