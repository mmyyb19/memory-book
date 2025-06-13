import pool from '../config/database';
import { logger } from '../utils/logger';

export interface User {
  id: number;
  username: string;
  verification_code: string;
  created_at: Date;
}

export class UserModel {
  static async create(username: string, verification_code: string): Promise<User> {
    try {
      const result = await pool.query(
        'INSERT INTO users (username, verification_code) VALUES ($1, $2) RETURNING *',
        [username, verification_code]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error finding user:', error);
      throw error;
    }
  }

  static async updateVerificationCode(username: string, verification_code: string): Promise<User> {
    try {
      const result = await pool.query(
        'UPDATE users SET verification_code = $1 WHERE username = $2 RETURNING *',
        [verification_code, username]
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating verification code:', error);
      throw error;
    }
  }
} 