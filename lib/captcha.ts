import crypto from 'crypto';

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || 'bspnws_default_super_secret_captcha_key_2026';

export interface CaptchaData {
  question: string;
  token: string;
}

export function generateCaptcha(): CaptchaData {
  const num1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
  const num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
  const isAddition = Math.random() > 0.5;

  const question = isAddition 
    ? `${num1} + ${num2}` 
    : `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
  
  const answer = isAddition 
    ? num1 + num2 
    : Math.max(num1, num2) - Math.min(num1, num2);

  const timestamp = Date.now();
  const stringToSign = `${timestamp}:${answer}`;
  const hash = crypto.createHmac('sha256', CAPTCHA_SECRET).update(stringToSign).digest('hex');
  const token = `${timestamp}:${hash}`;

  return {
    question,
    token
  };
}

export function verifyCaptcha(token: string, answer: string): boolean {
  if (!token || !answer) return false;

  const parts = token.split(':');
  if (parts.length !== 2) return false;

  const [timestampStr, hash] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return false;

  // Check expiration (e.g., 5 minutes)
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  if (now - timestamp > fiveMinutes || now < timestamp) {
    return false;
  }

  const stringToSign = `${timestamp}:${answer.trim()}`;
  const expectedHash = crypto.createHmac('sha256', CAPTCHA_SECRET).update(stringToSign).digest('hex');

  // Time-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  } catch {
    return false;
  }
}
