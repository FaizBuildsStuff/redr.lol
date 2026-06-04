import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "redrose-cyber-quantum-super-secret-key-2026";

interface SessionPayload {
  userId: number;
  username: string;
  email: string;
  expiresAt: number;
  issuedAt?: number;
}

export type UserSession = Omit<SessionPayload, "expiresAt" | "issuedAt"> & { issuedAt?: number };

/**
 * Creates a signed JWT-like token containing user session details.
 * Uses HMAC-SHA256 signature for tamper protection.
 */
export function createToken(payload: Omit<UserSession, "issuedAt">, durationInMs = 7 * 24 * 60 * 60 * 1000): string {
  const expiresAt = Date.now() + durationInMs;
  const issuedAt = Date.now();
  const data: SessionPayload = { ...payload, expiresAt, issuedAt };
  const dataStr = JSON.stringify(data);
  
  // Create HMAC signature
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(dataStr);
  const signature = hmac.digest("base64url");
  
  // Encode payload and combine with signature
  const base64Data = Buffer.from(dataStr).toString("base64url");
  return `${base64Data}.${signature}`;
}

/**
 * Verifies a token and extracts the user session payload if valid.
 */
export function verifyToken(token: string | undefined): UserSession | null {
  if (!token) return null;
  
  try {
    const [base64Data, signature] = token.split(".");
    if (!base64Data || !signature) return null;
    
    // Verify signature
    const dataStr = Buffer.from(base64Data, "base64url").toString("utf8");
    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(dataStr);
    const expectedSignature = hmac.digest("base64url");
    
    if (signature !== expectedSignature) {
      return null; // Tampered token
    }
    
    const data = JSON.parse(dataStr) as SessionPayload;
    if (Date.now() > data.expiresAt) {
      return null; // Expired token
    }
    
    return {
      userId: data.userId,
      username: data.username,
      email: data.email,
      issuedAt: data.issuedAt,
    };
  } catch (e) {
    return null;
  }
}
