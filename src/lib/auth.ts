import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { IUser } from '@/models/User';

// Funkcja do hashowania hasła z solą
export async function hashPassword(password: string): Promise<{ hashedPassword: string; salt: string }> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  
  return { hashedPassword, salt };
}

// Funkcja do weryfikacji hasła
export async function verifyPassword(user: IUser, password: string): Promise<boolean> {
  const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('hex');
  return hashedPassword === user.hashedPassword;
}

// Funkcja do generowania tokenu JWT
export async function generateToken(user: IUser): Promise<string> {
  const secret = process.env.JWT_SECRET || 'default_secret';
  const encodedSecret = new TextEncoder().encode(secret);
  
  const jwt = await new SignJWT({
    id: user._id ? user._id.toString() : '',
    username: user.username,
    role: user.role,
    email: user.email || ''
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h') // Token wygasa po 12 godzinach
    .sign(encodedSecret);

  return jwt;
}

// Funkcja do weryfikacji tokenu JWT
export async function verifyToken(token: string): Promise<any | null> {
  try {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const encodedSecret = new TextEncoder().encode(secret);
    
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    console.error('Błąd weryfikacji tokenu:', error);
    return null;
  }
}
