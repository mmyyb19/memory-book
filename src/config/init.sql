-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  verification_code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户内容表模板
CREATE OR REPLACE FUNCTION create_user_content_table(user_id INTEGER)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS user_%s_content (
      id SERIAL PRIMARY KEY,
      type VARCHAR(10) NOT NULL CHECK (type IN (''text'', ''image'', ''video'')),
      content TEXT NOT NULL,
      file_path VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  ', user_id);
END;
$$ LANGUAGE plpgsql; 