import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, env.jwtSecret) as { userId: string };
}

export function signMagicToken(userId: string): string {
  return jwt.sign({ userId, type: 'magic' }, env.magicLinkSecret, {
    expiresIn: `${env.magicLinkExpiresMinutes}m`,
  });
}

export function verifyMagicToken(token: string): { userId: string; type: string } {
  return jwt.verify(token, env.magicLinkSecret) as { userId: string; type: string };
}
