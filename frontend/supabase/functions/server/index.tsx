import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-eeb3c957/health", (c) => {
  return c.json({ status: "ok" });
});

// Seeded user credentials with salted SHA-256 hashes
const USER_SALT = "seedha_user_salt_2026";
const ADMIN_SALT = "seedha_admin_salt_2026";
const SIGNING_SECRET = "seedha_jwt_dev_secret_key_889911";

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  salt: string;
  passwordHash: string;
  phone: string;
}

const SEED_USERS: StoredUser[] = [
  {
    id: "USR-DEV-001",
    email: "user@onbroker.com",
    name: "Rahul Sharma",
    role: "USER",
    salt: USER_SALT,
    // Salted SHA-256 hash for User@123
    passwordHash: "4f2424015c248b82f2d3595fe4763c97d32192916b46b74b1a8e92bb7dc385e6",
    phone: "+91 98765 43210",
  },
  {
    id: "ADM-DEV-901",
    email: "admin@onbroker.com",
    name: "Seedha Operations Admin",
    role: "ADMIN",
    salt: ADMIN_SALT,
    // Salted SHA-256 hash for Admin@123
    passwordHash: "0a9339413ba92e014f982b62599a69e104de4368299c2565f89f0ab2ef34b2d8",
    phone: "+91 98480 99887",
  },
];

async function hashSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate signed session token
async function generateToken(user: StoredUser): Promise<string> {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  const payloadStr = JSON.stringify(payload);
  const signature = (await hashSha256(payloadStr + SIGNING_SECRET)).slice(0, 32);
  const b64 = btoa(unescape(encodeURIComponent(payloadStr)));
  return `sdt_${b64}.${signature}`;
}

// Verify token
async function verifyToken(token?: string): Promise<{ valid: boolean; user?: any; error?: string }> {
  if (!token || !token.startsWith("sdt_")) {
    return { valid: false, error: "Missing or invalid token" };
  }
  try {
    const raw = token.slice(4);
    const [b64, sig] = raw.split(".");
    const payloadStr = decodeURIComponent(escape(atob(b64)));
    const expectedSig = (await hashSha256(payloadStr + SIGNING_SECRET)).slice(0, 32);
    if (sig !== expectedSig) {
      return { valid: false, error: "Signature mismatch" };
    }
    const payload = JSON.parse(payloadStr);
    if (Date.now() > payload.exp) {
      return { valid: false, error: "Token expired" };
    }
    return { valid: true, user: payload };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

// Auth Login Route handler
const handleLogin = async (c: any) => {
  try {
    const body = await c.req.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const requestedRole = body.requestedRole;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const user = SEED_USERS.find((u) => u.email.toLowerCase() === email);
    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const computedHash = await hashSha256(password + user.salt);
    if (computedHash !== user.passwordHash) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Role verification
    if (requestedRole && requestedRole !== user.role) {
      if (requestedRole === "ADMIN" && user.role !== "ADMIN") {
        return c.json(
          { error: "Access Denied: This account lacks administrator privileges" },
          403
        );
      }
    }

    const token = await generateToken(user);

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err: any) {
    return c.json({ error: err.message || "Internal server error" }, 500);
  }
};

app.post("/make-server-eeb3c957/auth/login", handleLogin);
app.post("/api/auth/login", handleLogin);

// Verify Token Route handler
const handleVerify = async (c: any) => {
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const result = await verifyToken(token);
  if (!result.valid) {
    return c.json({ valid: false, error: result.error }, 401);
  }
  return c.json({ valid: true, user: result.user });
};

app.post("/make-server-eeb3c957/auth/verify", handleVerify);
app.post("/api/auth/verify", handleVerify);

// Protected Admin API Endpoint (Verifies RBAC)
const handleAdminStats = async (c: any) => {
  const authHeader = c.req.header("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const result = await verifyToken(token);

  if (!result.valid) {
    return c.json({ error: "Unauthorized: Invalid or missing token" }, 401);
  }

  // Strict role check
  if (result.user.role !== "ADMIN") {
    return c.json({ error: "Forbidden: Account does not have ADMIN privileges" }, 403);
  }

  return c.json({
    authorized: true,
    message: "Admin metrics unlocked",
    queues: 7,
    activeAdmins: 1,
  });
};

app.get("/make-server-eeb3c957/admin/stats", handleAdminStats);
app.get("/api/admin/stats", handleAdminStats);

Deno.serve(app.fetch);