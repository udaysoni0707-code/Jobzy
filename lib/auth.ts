import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { UserRole, UserSession } from '@/types';

const SESSION_COOKIE_NAME = 'skillnova_session';

export class AuthService {
  /**
   * Hash a plain text password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  /**
   * Encode user session into a base64 secure token
   */
  static encodeSession(session: UserSession): string {
    const payload = JSON.stringify({
      ...session,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return Buffer.from(payload).toString('base64');
  }

  /**
   * Decode session token
   */
  static decodeSession(token: string): UserSession | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const parsed = JSON.parse(decoded);
      if (parsed.exp && parsed.exp < Date.now()) {
        return null;
      }
      return {
        id: parsed.id,
        email: parsed.email,
        name: parsed.name,
        role: parsed.role,
        avatarUrl: parsed.avatarUrl,
        district: parsed.district,
        isVerified: parsed.isVerified,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get current logged-in user session from cookies
   */
  static async getCurrentUser(): Promise<UserSession | null> {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return this.decodeSession(token);
  }

  /**
   * Check if current user has an authorized role
   */
  static async requireRole(allowedRoles: UserRole[]): Promise<UserSession> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Unauthorized: Authentication required');
    }
    if (!allowedRoles.includes(user.role)) {
      throw new Error(`Forbidden: Role "${user.role}" is not authorized for this action`);
    }
    return user;
  }
}
