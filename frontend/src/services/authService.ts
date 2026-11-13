/**
 * Seedha Properties - Secure Authentication & Authorization Service
 *
 * Implements role-based access control (RBAC), salted cryptographic password
 * hashing, development account seeding, session token generation, and verification.
 */

export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  city?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
  code?: 'INVALID_CREDENTIALS' | 'ROLE_DENIED' | 'ACCOUNT_LOCKED' | 'SERVER_ERROR';
}

interface StoredUserRecord {
  id: string;
  email: string;
  name: string;
  salt: string;
  passwordHash: string;
  role: UserRole;
  phone: string;
  city: string;
}

/**
 * Pure TypeScript cryptographic SHA-256 implementation.
 * Zero external native dependencies; executes identically across Android, iOS, Web, and Node.
 */
export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number;
  let j: number;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength | 0;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice();
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = hash[0];
      const b = hash[1];
      const c = hash[2];
      const d = hash[3];
      const e = hash[4];
      const f = hash[5];
      const g = hash[6];
      const h = hash[7];

      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 =
        (h +
          s1 +
          ch +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : ((w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0))) |
        0;

      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;

      hash = [(temp1 + temp2) | 0, a, b, c, (d + temp1) | 0, e, f, g];
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (let i2 = 3; i2 >= 0; i2--) {
      const b = (hash[i] >> (i2 * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Computes a salted cryptographic hash of the password.
 */
export function hashPasswordWithSalt(password: string, salt: string): string {
  return sha256(password + salt);
}

// Development Salt Keys (isolated per account)
const USER_SALT = 'seedha_user_salt_2026';
const ADMIN_SALT = 'seedha_admin_salt_2026';
const SIGNING_SECRET = 'seedha_jwt_dev_secret_key_889911';

/**
 * Seeded development account database.
 * Passwords stored strictly as salted SHA-256 hashes.
 */
const SEED_DATABASE: StoredUserRecord[] = [
  {
    id: 'USR-DEV-001',
    email: 'user@onbroker.com',
    name: 'Rahul Sharma',
    salt: USER_SALT,
    // Hash of "User@123" + USER_SALT
    passwordHash: '4f2424015c248b82f2d3595fe4763c97d32192916b46b74b1a8e92bb7dc385e6',
    role: 'USER',
    phone: '+91 98765 43210',
    city: 'Hyderabad',
  },
  {
    id: 'ADM-DEV-901',
    email: 'admin@onbroker.com',
    name: 'Seedha Operations Admin',
    salt: ADMIN_SALT,
    // Hash of "Admin@123" + ADMIN_SALT
    passwordHash: '0a9339413ba92e014f982b62599a69e104de4368299c2565f89f0ab2ef34b2d8',
    role: 'ADMIN',
    phone: '+91 98480 99887',
    city: 'Hyderabad',
  },
];

/**
 * Generates a signed session token.
 */
function createSessionToken(user: StoredUserRecord): AuthSession {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    exp: expiresAt,
  };

  const payloadStr = JSON.stringify(payload);
  const signature = sha256(payloadStr + SIGNING_SECRET);
  // Base64-safe representation
  const encodedPayload = typeof btoa !== 'undefined'
    ? btoa(unescape(encodeURIComponent(payloadStr)))
    : ((globalThis as any).Buffer?.from(payloadStr).toString('base64') || payloadStr);

  const token = `sdt_${encodedPayload}.${signature.slice(0, 32)}`;

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      city: user.city,
    },
    expiresAt,
  };
}

/**
 * Validates and decodes a signed session token.
 */
export function verifySessionToken(token: string | null | undefined): {
  valid: boolean;
  user?: AuthUser;
  error?: string;
} {
  if (!token || !token.startsWith('sdt_')) {
    return { valid: false, error: 'Missing or malformed session token' };
  }

  try {
    const raw = token.slice(4);
    const [encodedPayload, sig] = raw.split('.');
    if (!encodedPayload || !sig) {
      return { valid: false, error: 'Invalid token structure' };
    }

    const payloadStr = typeof atob !== 'undefined'
      ? decodeURIComponent(escape(atob(encodedPayload)))
      : ((globalThis as any).Buffer?.from(encodedPayload, 'base64').toString('utf8') || encodedPayload);

    const expectedSig = sha256(payloadStr + SIGNING_SECRET).slice(0, 32);
    if (sig !== expectedSig) {
      return { valid: false, error: 'Token signature mismatch' };
    }

    const payload = JSON.parse(payloadStr);
    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Session token has expired' };
    }

    return {
      valid: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role as UserRole,
        phone: payload.phone,
      },
    };
  } catch (err: any) {
    return { valid: false, error: 'Failed to decode token: ' + err.message };
  }
}

/**
 * Authorizes admin access strictly by inspecting token validity and verified role.
 * Normal users (USER role) are blocked here even if front-end state is manipulated.
 */
export function authorizeAdmin(token: string | null | undefined): boolean {
  const result = verifySessionToken(token);
  return result.valid && result.user?.role === 'ADMIN';
}

/**
 * Primary authentication handler.
 * Verifies credentials against salted password hashes and enforces role restrictions.
 */
export async function authenticateCredentials(
  emailInput: string,
  passwordInput: string,
  requestedRole?: UserRole
): Promise<AuthResult> {
  const normalizedEmail = (emailInput || '').trim().toLowerCase();
  const trimmedPassword = (passwordInput || '').trim();

  if (!normalizedEmail || !trimmedPassword) {
    return {
      success: false,
      error: 'Please enter both email and password.',
      code: 'INVALID_CREDENTIALS',
    };
  }

  // Find user in seeded database
  const record = SEED_DATABASE.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!record) {
    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials.',
      code: 'INVALID_CREDENTIALS',
    };
  }

  // Hash user input with stored salt
  const computedHash = hashPasswordWithSalt(trimmedPassword, record.salt);

  if (computedHash !== record.passwordHash) {
    return {
      success: false,
      error: 'Invalid email or password. Please check your credentials.',
      code: 'INVALID_CREDENTIALS',
    };
  }

  // Enforce Role Access Control
  if (requestedRole && requestedRole !== record.role) {
    if (requestedRole === 'ADMIN' && record.role === 'USER') {
      return {
        success: false,
        error: 'Access Denied: This account has USER role and does not have administrator privileges.',
        code: 'ROLE_DENIED',
      };
    }
  }

  // Generate verified session token
  const session = createSessionToken(record);

  return {
    success: true,
    session,
  };
}

/**
 * Development helper returning sample account details for testing reference.
 */
export function getSampleAccountsInfo() {
  return [
    {
      role: 'USER' as UserRole,
      email: 'user@onbroker.com',
      password: 'User@123',
      description: 'Full consumer flow (Buy, Rent, Commercial, Property Mgmt, Loans, Agreements, Owner Verification)',
    },
    {
      role: 'ADMIN' as UserRole,
      email: 'admin@onbroker.com',
      password: 'Admin@123',
      description: 'Operations Admin Hub (7 Review Queues, Location match decisions, Direct contact, Document delivery)',
    },
  ];
}
