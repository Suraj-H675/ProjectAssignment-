import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { JwtPayload } from '../types/index';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: 604800 }); // 7 days in seconds
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const authConfig = {
  secret: JWT_SECRET,
  expiresIn: '7d',
};