const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// PostgreSQL 连接配置
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'memory_book',
    password: '15963qwe123', // 请替换为你的 PostgreSQL 密码
    port: 5432,
});

// 创建数据库表
async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS memories (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id VARCHAR(255)
            );
        `);
        console.log('数据库表创建成功');
    } catch (error) {
        console.error('创建数据库表失败:', error);
    }
}

createTable();

// 文件上传配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// API 路由
app.post('/api/memories', upload.single('image'), async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            'INSERT INTO memories (title, content, image_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, imageUrl, userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('保存记忆包裹失败:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/memories', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM memories ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('获取记忆包裹失败:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`);
}); 